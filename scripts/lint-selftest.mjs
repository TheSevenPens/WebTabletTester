import assert from 'node:assert/strict';
import { ESLint } from 'eslint';

// A fixture-only rule proves coverage without depending on the app's policy for `any`.
const eslint = new ESLint({ overrideConfig: { rules: { 'no-debugger': 'error' } } });
const fixtures = [
    ['src/lint-fixture.ts', 'export const value: number = 1; debugger;'],
    [
        'src/LintFixture.svelte',
        '<script lang="ts">const value: number = 1; debugger;</script><p>{value}</p>',
    ],
];

for (const [filePath, source] of fixtures) {
    const [result] = await eslint.lintText(source, { filePath });
    assert.ok(
        result?.messages.some((message) => message.ruleId === 'no-debugger'),
        `ESLint must parse and lint ${filePath}; got ${JSON.stringify(result?.messages)}`
    );
}
console.log('ESLint coverage verified for TypeScript and Svelte.');
