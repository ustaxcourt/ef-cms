// @ts-check
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginCypress from 'eslint-plugin-cypress/flat';
import pluginJest from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';

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
      'scripts/run-once-scripts/**/*',
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
  },
  {
    // jest configuration
    files: ['**/*.test.ts', '**/*.test.js'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      'jest/no-disabled-tests': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'warn',
      'jest/prefer-to-have-length': 'off',
      'jest/valid-expect': 'error',
      'jest/no-export': 'off',
    },
  },
  prettierConfig, // This config ignores formatting rules in the linter. Linters are not formatters.
  pluginCypress.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    // Typescript specific rules. Most are turned off as we have not been using typescript for long enough.
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
      '@typescript-eslint/no-unused-vars': 'error',
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
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        projectService: {
          allowDefaultProject: ['*.js', '*.mjs'],
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
      'scripts/run-once-scripts/**/*',
    ],
  },
  {
    files: ['**/*.js', 'scripts/run-once-scripts/**/*', 'cypress/**/*.ts'], // Do not use typechecking on javascript files, run once scripts, or cypress which has different promise chains
    extends: [tseslint.configs.disableTypeChecked],
  },
);
