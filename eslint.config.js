import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig(
    globalIgnores([
        '**/node_modules',
        '**/dist',
        '**/build',
        '**/.svelte-kit',
        '**/output',
        '**/*.min.js',
    ]),
    js.configs.recommended,
    ts.configs.recommended,
    svelte.configs.recommended,
    prettier,
    svelte.configs.prettier,
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: { 'no-undef': 'off' },
    },
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parser: svelte.parser,
            parserOptions: {
                parser: ts.parser,
                extraFileExtensions: ['.svelte'],
            },
        },
    },
);
