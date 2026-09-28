import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const urls = process.argv.slice(2);
if (!urls.length) throw new Error('Usage: node scripts/profile.mjs <app URL> [baseline URL]');
const browser = await chromium.launch({ headless: true });
await mkdir('test-results', { recursive: true });

try {
    for (const [index, url] of urls.entries()) {
        const context = await browser.newContext({
            viewport: { width: 1440, height: 900 },
            deviceScaleFactor: 1,
        });
        const page = await context.newPage();
        await page.goto(url);
        const canvas = page.locator('canvas[aria-label="Drawing canvas"], #myCanvas');
        await canvas.waitFor({ state: 'visible' });
        await page.evaluate(
            () =>
                new Promise((resolve) =>
                    requestAnimationFrame(() => requestAnimationFrame(resolve))
                )
        );
        const box = await canvas.boundingBox();
        if (!box) throw new Error('Canvas missing');
        const runs = [];
        for (let run = 0; run < 6; run++) {
            await page.mouse.move(box.x + 80, box.y + 80);
            await page.mouse.down();
            await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
            runs.push(
                await canvas.evaluate(async (element, paced) => {
                    const ctx = element.getContext('2d');
                    const rect = element.getBoundingClientRect();
                    const drawImage = ctx.drawImage;
                    let blits = 0;
                    ctx.drawImage = function (...args) {
                        blits++;
                        return drawImage.apply(this, args);
                    };
                    let handlerMs = 0;
                    const started = performance.now();
                    for (let group = 0; group < 60; group++) {
                        if (paced) await new Promise((resolve) => requestAnimationFrame(resolve));
                        const before = performance.now();
                        for (let sample = 0; sample < 4; sample++) {
                            const n = group * 4 + sample;
                            element.dispatchEvent(
                                new PointerEvent('pointermove', {
                                    pointerId: 1,
                                    pointerType: 'mouse',
                                    buttons: 1,
                                    pressure: 0.5,
                                    clientX: rect.left + 80 + n * 0.5,
                                    clientY: rect.top + 80 + Math.sin(n / 12) * 20,
                                    bubbles: true,
                                })
                            );
                        }
                        handlerMs += performance.now() - before;
                    }
                    await new Promise((resolve) =>
                        requestAnimationFrame(() => requestAnimationFrame(resolve))
                    );
                    const wallMs = performance.now() - started;
                    ctx.drawImage = drawImage;
                    return {
                        trace: paced ? '60 frames × 4 samples' : '240-sample burst',
                        compositions: blits / 2,
                        handlerMs,
                        wallMs,
                    };
                }, run === 5)
            );
            await page.mouse.up();
        }
        const bursts = runs
            .slice(0, 5)
            .map((run) => run.handlerMs)
            .sort((a, b) => a - b);
        console.log(JSON.stringify({ url, burstMedianHandlerMs: bursts[2], runs }, null, 2));
        await page.screenshot({ path: `test-results/profile-${index}.png` });
        await context.close();
    }
} finally {
    await browser.close();
}
