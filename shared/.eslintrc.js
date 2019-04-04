module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier/standard',
  ],
  plugins: ['prettier', 'jsdoc', 'sort-keys-fix', 'sort-requires', 'jest'],
  rules: {
    'sort-requires/sort-requires': 2,
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'jsdoc/require-param': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/check-types': 1,
    'sort-keys-fix/sort-keys-fix': [
      'warn',
      'asc',
      { caseSensitive: false, natural: true },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
};
