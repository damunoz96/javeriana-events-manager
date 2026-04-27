import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import { tanstackConfig } from '@tanstack/eslint-config';
import pluginRouter from '@tanstack/eslint-plugin-router';
import pluginQuery from '@tanstack/eslint-plugin-query';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
  {
    ignores: ['*.config.ts', 'src/models/database.types.ts', 'src/components/ui/*'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      js,
      prettier: pluginPrettier,
    },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  ...pluginRouter.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
  ...tanstackConfig,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@tanstack/router/create-route-property-order': 'error',
      'react/no-children-prop': 'off',
      'prettier/prettier': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
    },
  },
  eslintConfigPrettier,
]);
