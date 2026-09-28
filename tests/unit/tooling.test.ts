import { expect, it } from 'vitest';
import { ESLint } from 'eslint';

it('lints TypeScript and Svelte sources instead of silently ignoring them', async () => {
    const eslint = new ESLint();
    const typescript = await eslint.lintText('export const value: any = 1;', {
        filePath: 'src/lint-fixture.ts',
    });
    const svelte = await eslint.lintText(
        '<script lang="ts">let value: any = 1;</script><p>{value}</p>',
        { filePath: 'src/LintFixture.svelte' }
    );
    for (const result of [typescript, svelte]) {
        expect(
            result[0]?.messages.some(
                (message) => message.ruleId === '@typescript-eslint/no-explicit-any'
            )
        ).toBe(true);
    }
}, 15000);
