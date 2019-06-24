module.exports = {
  extends: ['prettier', 'eslint:recommended', 'plugin:security/recommended'],
  plugins: [
    'jest',
    'jsdoc',
    'prettier',
    'security',
    'sort-destructure-keys',
    'sort-keys-fix',
    'sort-requires',
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'dot-location': ['error', 'property'],
    'dot-notation': 'error',
    'jsdoc/check-param-names': 1,
    'jsdoc/check-types': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param-type': 1,
    'jsdoc/require-param': 1,
    'jsdoc/require-returns-check': 1,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 1,
    'jsdoc/require-returns': 1,
    'jsdoc/valid-types': 1,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-useless-escape': 'off',
    'sort-requires/sort-requires': 2,
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'sort-keys-fix/sort-keys-fix': [
      'error',
      'asc',
      { caseSensitive: true, natural: true },
    ],
    'sort-destructure-keys/sort-destructure-keys': [
      2,
      { caseSensitive: false },
    ],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
  },
  env: {
    es6: true,
    'jest/globals': true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 9,
  },
};
