module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier/standard',
  ],
  plugins: [
    'jest',
    'jsdoc',
    'prettier',
    'sort-destructure-keys',
    'sort-keys-fix',
    'sort-requires',
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'jsdoc/check-types': 1,
    'jsdoc/require-jsdoc': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param': 1,
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
    'sort-destructure-keys/sort-destructure-keys': [
      2,
      { caseSensitive: false },
    ],
    'sort-requires/sort-requires': 2,
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
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
