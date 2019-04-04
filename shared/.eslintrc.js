module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier/standard',
  ],
  plugins: ['prettier', 'jsdoc', 'sort-keys-fix', 'sort-requires', 'jest'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'jsdoc/check-types': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param': 1,
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
    'sort-requires/sort-requires': 2,
    'sort-keys-fix/sort-keys-fix': [
      'error',
      'asc',
      { caseSensitive: true, natural: true },
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
