module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
    'prettier/standard',
  ],
  plugins: [
    'prettier',
    'react',
    'jsx-a11y',
    'cypress',
    'jest',
    'jsdoc',
    'sort-keys-fix',
  ],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'jsdoc/require-param': 1,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param-type': 1,
    'jsdoc/valid-types': 1,
    'jsdoc/require-returns': 1,
    'jsdoc/require-returns-check': 1,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/check-param-names': 1,
    'jsdoc/check-types': 1,
    'prettier/prettier': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'jsx-a11y/label-has-for': [
      2,
      {
        components: ['Label'],
        required: {
          every: ['id'],
        },
        allowChildren: false,
      },
    ],
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'sort-keys-fix/sort-keys-fix': [
      'warn',
      'asc',
      { caseSensitive: false, natural: true },
    ],
  },
  settings: {
    react: {
      version: '16.8.3',
    },
  },
  env: {
    'cypress/globals': true,
    'jest/globals': true,
    browser: true,
    es6: true,
    mocha: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    jsx: true,
  },
};
