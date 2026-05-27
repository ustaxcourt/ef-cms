// @ts-check
/**
 * Slim ESLint config — covers ONLY what Biome cannot replace.
 *
 * Run this together with `biome check` via `npm run lint:js/ts:biome` as a
 * 1:1 drop-in equivalent for the full `npm run lint:js/ts`.
 *
 * What each tool owns:
 *
 *   Biome (biome.json + biome-plugins/)
 *     - eslint.configs.recommended core rules
 *     - typescript-eslint: no-floating-promises, no-implied-eval,
 *       no-misused-promises, no-unused-vars, no-unused-expressions,
 *       require-await, no-array-constructor
 *     - jsx-a11y recommended  (Biome lint/a11y)
 *     - React: jsx-key, no-children-prop, jsx-no-target-blank, jsx-uses-vars
 *     - complexity, max-lines, no-restricted-globals, no-var,
 *       no-unneeded-ternary, prefer-destructuring, no-trailing-spaces
 *     - Formatter: eol-last, trailing spaces, print width, quotes, semi
 *     - custom no-dates (GritQL plugins)
 *
 *   This file (ESLint — only the gaps)
 *     - eslint-plugin-cypress   ← zero Biome coverage
 *     - eslint-plugin-jest      ← zero Biome coverage
 *     - eslint-plugin-react recommended (minus the 4 rules Biome covers)
 *     - no-warning-comments     ← GritQL cannot match comment nodes
 *     - id-denylist: test       ← GritQL only covers const/let/var; ESLint
 *                                  catches params, imports, destructuring, etc.
 *     - object-shorthand        ← no Biome equivalent
 *     - @typescript-eslint/prefer-promise-reject-errors ← no Biome equivalent
 */

import pluginCypress from 'eslint-plugin-cypress';
import pluginJest from 'eslint-plugin-jest';
import reactPlugin from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

const IGNORES = [
  '**/node_modules/',
  '**/dist/',
  '**/dist-lambdas/',
  '**/*.js',
  '**/build/',
  '*.config.js',
  '**/*_.js',
  'scripts/archived/**/*',
];

const CYPRESS_FILES = [
  'cypress/**/*.ts',
  'cypress.config.ts',
  'cypress-smoketests.config.ts',
  'cypress-smoketests-readonly.config.ts',
  'cypress-smoketests-readonly-public.config.ts',
  'cypress-public.config.ts',
];

export default tseslint.config(
  // ─── TypeScript parser setup — needed so ESLint processes .ts/.tsx files ──
  // This installs the @typescript-eslint parser without enabling any rules
  // (Biome handles the TS-specific rules).
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { sourceType: 'module' },
    },
  },

  // ─── General rules with no Biome equivalent ───────────────────────────────
  {
    ignores: IGNORES,
    rules: {
      // Biome's GritQL plugins cannot match comment nodes
      'no-warning-comments': [
        'error',
        { location: 'anywhere', terms: ['fixme', 'xxx'] },
      ],
      // GritQL only covers const/let/var declarations; ESLint catches function
      // params, destructuring bindings, import specifiers, class members, etc.
      'id-denylist': ['error', 'test'],
      // No Biome equivalent
      'object-shorthand': 'warn',
    },
  },

  // ─── React plugin — rules Biome does NOT cover ────────────────────────────
  // Note: react/jsx-key, react/no-children-prop, react/jsx-no-target-blank,
  // and react/jsx-uses-vars overlap with Biome rules but are included here for
  // completeness so this config remains a faithful superset of the original.
  // @ts-ignore — flat config types mismatch between plugin versions
  reactPlugin.configs.flat.recommended,
  {
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // @ts-ignore
      ...reactPlugin.configs.flat.recommended.rules,
      'react/prop-types': 'warn',
      // Not needed with React 17+ automatic JSX transform
      'react/react-in-jsx-scope': 'off',
    },
  },

  // ─── Jest plugin — no Biome equivalent ────────────────────────────────────
  {
    files: ['**/*.test.ts', '**/*.test.js'],
    ignores: IGNORES,
    ...pluginJest.configs['flat/recommended'],
  },

  // ─── Cypress plugin — no Biome equivalent ─────────────────────────────────
  {
    ...pluginCypress.configs.recommended,
    ignores: IGNORES,
  },

  // ─── Type-checked rules with no Biome equivalent ──────────────────────────
  {
    ignores: [...IGNORES, ...CYPRESS_FILES],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        projectService: {
          allowDefaultProject: [
            '*.mjs',
            '*/*.mjs',
            '*/*/*/*/*.mjs',
            '*/*/*/.*.cjs',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/prefer-promise-reject-errors': 'error',
    },
  },

  // ─── Disable type-checking for cypress and JS/config files ────────────────
  // Mirrors the disableTypeChecked override in the original eslint.config.mjs
  {
    files: ['**/*.js', 'scripts/archived/**/*', ...CYPRESS_FILES],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
