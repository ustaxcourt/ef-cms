// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginCypress from 'eslint-plugin-cypress/flat';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  pluginCypress.configs.recommended,
  {
    // env: {
    //   browser: true,
    //   es6: true,
    //   node: true,
    //   'cypress/globals': true,
    //   'jest/globals': true,
    // },
    // extends: [
    //   'eslint:recommended',
    //   'plugin:cypress/recommended',
    //   'plugin:jest/recommended',
    //   'plugin:prettier/recommended',
    //   'plugin:@typescript-eslint/recommended',
    //   'plugin:react/recommended',
    //   'prettier',
    // ],
    // parser: '@typescript-eslint/parser',
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
        // project: ['./tsconfig.json'],
      },
    },
    // plugins: ['jest', 'prettier', '@typescript-eslint', 'react'],
    // rules: {
    //   'prettier/prettier': 'error',
    //   '@typescript-eslint/no-unused-vars': [
    //     'error',
    //     { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    //   ],
    //   '@typescript-eslint/no-floating-promises': 'error',
    //   '@typescript-eslint/no-misused-promises': [
    //     'error',
    //     {
    //       checksVoidReturn: false,
    //     },
    //   ],
    //   'react/react-in-jsx-scope': 'off', // Not needed with modern React
    //   'react/prop-types': 'off',
    //   'jest/no-disabled-tests': 'warn',
    //   'jest/no-focused-tests': 'error',
    //   'jest/no-identical-title': 'error',
    //   'jest/prefer-to-have-length': 'warn',
    //   'jest/valid-expect': 'error',
    // },
    // settings: {
    //   react: {
    //     version: 'detect',
    //   },
    //   'import/resolver': {
    //     node: {
    //       extensions: ['.js', '.jsx', '.ts', '.tsx'],
    //     },
    //   },
    // },
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '*.config.js',
      '**/*_.js',
      'scripts/run-once-scripts/**/*',
    ],
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
