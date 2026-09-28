import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const canvasSelector = 'canvas[aria-label="Drawing canvas"]';
const pageErrors = new WeakMap<Page, string[]>();

async function point(page: Page, x = 80, y = 80) {
    const box = await page.locator(canvasSelector).boundingBox();
    if (!box) throw new Error('Canvas was not mounted');
    return { x: box.x + x, y: box.y + y };
}

async function tap(page: Page) {
    const position = await point(page);
    await page.mouse.click(position.x, position.y);
    await expect.poll(() => pixel(page, 80, 80)).toEqual([0, 0, 0, 255]);
}

async function pixel(page: Page, x: number, y: number) {
    return page.locator(canvasSelector).evaluate((element, position) => {
        const canvas = element as HTMLCanvasElement;
        return Array.from(canvas.getContext('2d')!.getImageData(position.x, position.y, 1, 1).data);
    }, { x, y });
}

async function showStats(page: Page) {
    await page.getByRole('button', { name: 'Expand Options panel' }).click();
    await page.getByLabel('Show stroke stats').check();
}

test.beforeEach(async ({ page }) => {
    const errors: string[] = [];
    pageErrors.set(page, errors);
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('./');
    await expect(page.locator(canvasSelector)).toBeVisible();
    await expect.poll(() => pixel(page, 400, 400)).toEqual([230, 230, 250, 255]);
});

test.afterEach(async ({ page }) => {
    expect(pageErrors.get(page)).toEqual([]);
});

test('tap, eraser, clear, and background changes preserve layer behavior', async ({ page }) => {
    await tap(page);
    await page.getByRole('button', { name: 'Expand Options panel' }).click();
    await page.getByLabel('Background color').fill('#ffffff');
    await expect.poll(() => pixel(page, 400, 400)).toEqual([255, 255, 255, 255]);
    expect(await pixel(page, 80, 80)).toEqual([0, 0, 0, 255]);
    await page.getByRole('combobox', { name: 'Type', exact: true }).selectOption('ERASER');
    const position = await point(page);
    await page.mouse.click(position.x, position.y);
    await expect.poll(() => pixel(page, 80, 80)).toEqual([255, 255, 255, 255]);
    await page.getByRole('combobox', { name: 'Type', exact: true }).selectOption('MARKER');
    await tap(page);
    await page.getByRole('button', { name: 'CLEAR', exact: true }).click();
    await expect.poll(() => pixel(page, 80, 80)).toEqual([255, 255, 255, 255]);
});

test('editing a field does not clear the drawing, while a focused canvas shortcut does', async ({ page }) => {
    await tap(page);
    const zoom = page.getByRole('spinbutton', { name: 'Zoom %', exact: true });
    await zoom.focus();
    await zoom.press('Backspace');
    await zoom.press('Delete');
    expect(await pixel(page, 80, 80)).toEqual([0, 0, 0, 255]);
    await page.locator(canvasSelector).focus();
    await page.keyboard.press('Control+Backspace');
    expect(await pixel(page, 80, 80)).toEqual([0, 0, 0, 255]);
    await page.keyboard.press('Backspace');
    await expect.poll(() => pixel(page, 80, 80)).toEqual([230, 230, 250, 255]);
});

test('button keyboard activation is preserved and zoom is anchored', async ({ page }) => {
    const zoom = page.getByRole('spinbutton', { name: 'Zoom %', exact: true });
    await page.getByRole('button', { name: 'Zoom in' }).focus();
    await page.keyboard.press('Space');
    await expect(zoom).toHaveValue('125');
    await page.getByRole('button', { name: 'RESET', exact: true }).click();
    await expect(zoom).toHaveValue('100');
    const anchor = await point(page, 120, 120);
    await page.mouse.move(anchor.x, anchor.y);
    await page.mouse.wheel(0, -100);
    await expect.poll(() => zoom.inputValue()).not.toBe('100');
    const box = await page.locator(canvasSelector).boundingBox();
    if (!box) throw new Error('Missing canvas');
    expect((anchor.x - box.x) / (box.width / 1920)).toBeCloseTo(120, 1);
});

test('panning uses capture and stops on release', async ({ page }) => {
    const position = await point(page);
    const before = await page.locator(canvasSelector).boundingBox();
    await page.mouse.move(position.x, position.y);
    await page.mouse.down({ button: 'middle' });
    await page.mouse.move(position.x + 50, position.y + 40);
    await page.mouse.up({ button: 'middle' });
    const after = await page.locator(canvasSelector).boundingBox();
    expect(after!.x - before!.x).toBeCloseTo(50);
    expect(after!.y - before!.y).toBeCloseTo(40);
    await page.mouse.move(position.x + 80, position.y + 80);
    expect((await page.locator(canvasSelector).boundingBox())!.x).toBeCloseTo(after!.x);
    expect(await pixel(page, 80, 80)).toEqual([230, 230, 250, 255]);
});

test('a stroke released outside the canvas is finalized once', async ({ page }) => {
    const position = await point(page);
    await page.mouse.move(position.x, position.y);
    await page.mouse.down();
    await page.mouse.move(5, 5);
    await page.mouse.up();
    await showStats(page);
    const completed = page.getByRole('region', { name: 'Stroke statistics' }).locator('.stat-row').filter({ hasText: 'Completed' });
    await expect(completed).toHaveText('Completed1');
    const next = await point(page, 350, 350);
    await page.mouse.move(next.x, next.y);
    expect(await pixel(page, 350, 350)).toEqual([230, 230, 250, 255]);
});

for (const termination of ['pointercancel', 'lostpointercapture', 'blur'] as const) {
    test(`${termination} cancels the active stroke without counting a completed stroke`, async ({ page }) => {
        const position = await point(page);
        await page.mouse.move(position.x, position.y);
        await page.mouse.down();
        if (termination === 'blur') await page.evaluate(() => window.dispatchEvent(new Event('blur')));
        else await page.locator(canvasSelector).dispatchEvent(termination, { pointerId: 1, pointerType: 'mouse' });
        await page.mouse.up();
        await showStats(page);
        const panel = page.getByRole('region', { name: 'Stroke statistics' });
        await expect(panel.locator('.stat-row').filter({ hasText: 'Cancelled' })).toHaveText('Cancelled1');
        await expect(panel.locator('.stat-row').filter({ hasText: 'Completed' })).toHaveText('Completed0');
    });
}

test('statistics are collected while hidden', async ({ page }) => {
    await tap(page);
    await showStats(page);
    const panel = page.getByRole('region', { name: 'Stroke statistics' });
    await expect(panel.locator('.stat-row').filter({ hasText: 'Completed' })).toHaveText('Completed1');
    await expect(panel.locator('.stat-row').filter({ hasText: 'Samples', hasNotText: 'Samples/sec' })).toHaveText('Samples2');
});

test('processing reset preserves options and the curve preview updates', async ({ page }) => {
    await showStats(page);
    await page.getByLabel('Erase on stroke start').check();
    await page.getByRole('button', { name: 'Expand Processing panel' }).click();
    const curve = page.locator('.curve-graph');
    const before = await curve.evaluate((element) => (element as HTMLCanvasElement).toDataURL());
    const input = page.getByRole('spinbutton', { name: 'Pressure curve' });
    await input.fill('0.5');
    await input.press('Tab');
    await expect.poll(() => curve.evaluate((element) => (element as HTMLCanvasElement).toDataURL())).not.toBe(before);
    await page.getByRole('button', { name: 'RESET PROCESSING' }).click();
    await expect(input).toHaveValue('0.00');
    await expect(page.getByLabel('Erase on stroke start')).toBeChecked();
    await expect(page.getByLabel('Show stroke stats')).toBeChecked();
});

test('numeric action controls work with keyboard navigation', async ({ page }) => {
    await page.getByRole('button', { name: 'Expand Processing panel' }).click();
    const actions = page.getByLabel('Actions for Position smoothing');
    await actions.focus();
    await page.keyboard.press('Enter');
    const maximum = page.getByRole('button', { name: 'Maximum', exact: true }).first();
    await maximum.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('spinbutton', { name: 'Position smoothing' })).toHaveValue('0.999');
});

test('save exports the full document as a PNG', async ({ page }) => {
    await tap(page);
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'SAVE', exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^TabletTester_Untitled_.*\.png$/);
    const path = await download.path();
    if (!path) throw new Error('Missing downloaded PNG');
    const bytes = await readFile(path);
    expect(bytes.subarray(1, 4).toString()).toBe('PNG');
    expect(bytes.readUInt32BE(16)).toBe(1920);
    expect(bytes.readUInt32BE(20)).toBe(1080);
    await expect(page.getByRole('status')).toHaveText('PNG download started.');
});

test('copy reports unsupported or denied clipboard access', async ({ page }) => {
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
    await page.getByRole('button', { name: 'COPY', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Image copy is unavailable');
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
        configurable: true, value: { write: () => Promise.reject(new Error('Permission denied')) },
    }));
    await page.getByRole('button', { name: 'COPY', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Copy failed: Permission denied');
});

test('narrow screens retain reachable toolbar and sidebar controls', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.getByRole('button', { name: 'Expand Options panel' }).click();
    await expect(page.getByLabel('Show stroke stats')).toBeVisible();
    await page.getByRole('button', { name: 'Expand Processing panel' }).click();
    await page.getByRole('spinbutton', { name: 'Pressure smoothing' }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('spinbutton', { name: 'Pressure smoothing' })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
    await page.screenshot({ path: testInfo.outputPath('narrow.png') });
});

test('Space drag pans and blur releases the pan key', async ({ page }) => {
    const position = await point(page);
    await page.locator(canvasSelector).focus();
    await page.keyboard.down('Space');
    await page.mouse.move(position.x, position.y);
    await page.mouse.down();
    await page.mouse.move(position.x + 40, position.y + 20);
    await page.mouse.up();
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await page.keyboard.up('Space');
    expect(await pixel(page, 80, 80)).toEqual([230, 230, 250, 255]);
    await tap(page);
});

test('clipboard exports transparent foreground or an opaque composite', async ({ page }) => {
    await tap(page);
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
            write: async (items: ClipboardItem[]) => {
                const blob = await items[0].getType('image/png');
                const bitmap = await createImageBitmap(blob);
                const image = document.createElement('canvas');
                image.width = bitmap.width;
                image.height = bitmap.height;
                const ctx = image.getContext('2d')!;
                ctx.drawImage(bitmap, 0, 0);
                document.body.dataset.copiedAlpha = String(ctx.getImageData(400, 400, 1, 1).data[3]);
                document.body.dataset.copiedStrokeAlpha = String(ctx.getImageData(80, 80, 1, 1).data[3]);
                bitmap.close();
            },
        },
    }));
    await page.getByRole('button', { name: 'COPY', exact: true }).click();
    await expect(page.locator('body')).toHaveAttribute('data-copied-alpha', '0');
    await expect(page.locator('body')).toHaveAttribute('data-copied-stroke-alpha', '255');
    await page.getByRole('button', { name: 'COPY w/ BK', exact: true }).click();
    await expect(page.locator('body')).toHaveAttribute('data-copied-alpha', '255');
    await expect(page.getByRole('status')).toHaveText('Image copied to clipboard.');
});

test.describe('high DPI', () => {
    test.use({ deviceScaleFactor: 2 });
    test('Fit preserves pointer-to-document mapping', async ({ page }) => {
        await page.getByRole('button', { name: 'FIT', exact: true }).click();
        const box = await page.locator(canvasSelector).boundingBox();
        if (!box) throw new Error('Missing canvas');
        const scale = box.width / 1920;
        await page.mouse.click(box.x + 200 * scale, box.y + 200 * scale);
        await expect.poll(() => pixel(page, 200, 200)).toEqual([0, 0, 0, 255]);
    });
});
