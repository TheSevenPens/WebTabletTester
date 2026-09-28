import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    { ignores: ['dist/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'] },
    js.configs.recommended,
    ts.configs.recommended,
    svelte.configs.recommended,
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
    },
    {
        files: ['**/*.svelte'],
        languageOptions: { parserOptions: { parser: ts.parser } },
    }
);
