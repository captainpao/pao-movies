import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import lit from 'eslint-plugin-lit';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        CustomEvent: 'readonly',
        Event: 'readonly',
        HTMLInputElement: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      lit: lit,
      prettier: prettier,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'lit/no-legacy-template-syntax': 'error',
      'lit/binding-positions': 'error',
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
];
