// @ts-check
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginCypress from 'eslint-plugin-cypress/flat';
import pluginJest from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import customRulesPlugin from './eslint-custom-rules/eslint-custom-rules-plugin.mjs';

export default tseslint.config(
  {
    // eslint defaults
    ...eslint.configs.recommended,
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/dist-lambdas/',
      '**/*.js',
      '**/build/',
      '*.config.js',
      '**/*_.js',
      'scripts/archived/**/*',
    ],
  },
  {
    // eslint default rules that we added. No plugin required.
    rules: {
      complexity: ['warn', { max: 20 }],
      'eol-last': ['error', 'always'],
      'id-denylist': ['error', /* 'error', 'err', 'cb', 'callback',*/ 'test'],
      'max-lines': [
        'error',
        { max: 700, skipBlankLines: true, skipComments: true },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'error' },
        { name: 'event' },
        { name: 'status' },
        { name: 'name' },
        { name: 'document' },
      ],
      'no-trailing-spaces': 'error',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-var': 'error',
      'no-warning-comments': [
        'error',
        { location: 'anywhere', terms: ['fixme', 'xxx'] },
      ],
      'object-shorthand': 'warn',
      'prefer-destructuring': [
        'error',
        {
          AssignmentExpression: {
            array: false,
            object: true,
          },
          VariableDeclarator: {
            array: false,
            object: true,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
    },
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/dist-lambdas/',
      '**/*.js',
      '**/build/',
      '*.config.js',
      '**/*_.js',
      'scripts/archived/**/*',
    ],
  },
  {
    // jest configuration and recommendation
    files: ['**/*.test.ts', '**/*.test.js'],
    ...pluginJest.configs['flat/recommended'],
  },
  {
    // @ts-ignore
    ...reactPlugin.configs.flat.recommended, // React recommendations
    rules: {
      // @ts-ignore
      ...reactPlugin.configs.flat.recommended.rules,
      'react/prop-types': 'warn', // Temporarily turned off. Ideally this is on so we enforce typed inputs.
    },
  },
  jsxA11y.flatConfigs.recommended, // Accessibility recommendations
  prettierConfig, // This config ignores formatting rules in the linter. Linters are not formatters.
  pluginCypress.configs.recommended, // cypress recommendations
  tseslint.configs.recommendedTypeChecked,
  {
    // Typescript specific rules. Most are turned off as we have not been using typescript for long enough.
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        projectService: {
          allowDefaultProject: ['*.js', '*.mjs', '*.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/dist-lambdas/',
      '**/*.js',
      '**/build/',
      '*.config.js',
      '**/*_.js',
      'scripts/archived/**/*',
    ],
    rules: {
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-array-delete': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-non-null-assertion': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'off',
      'no-implied-eval': 'off',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-misused-new': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-unary-minus': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        // Do not allow unused variables unless they have the _ prefix or they are an error
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-wrapper-object-types': 'off',
      'no-throw-literal': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      'prefer-promise-reject-errors': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'error',
      'require-await': 'off',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: [
      '**/*.js',
      'scripts/archived/**/*',
      'cypress/**/*.ts',
      './cypress.config.ts',
      './cypress-smoketests.config.ts',
      './cypress-smoketests-readonly.config.ts',
      './cypress-smoketests-readonly-public.config.ts',
      './cypress-public.config.ts',
    ], // Do not use typechecking on javascript files, archived scripts, or cypress which has different promise chains
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    plugins: {
      'custom-rules-plugin': customRulesPlugin,
    },
    rules: {
      'custom-rules-plugin/no-new-dates': 'error',
    },
  },
);
