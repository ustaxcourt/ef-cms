module.exports = {
  extends: ['prettier', 'eslint:recommended', 'plugin:react/recommended'],
  plugins: ['prettier', 'jsx-a11y', 'cypress'],
  rules: {
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
  },
  settings: {
    react: {
      version: '16.6.0',
    },
  },
  env: {
    'cypress/globals': true,
    browser: true,
    es6: true,
    mocha: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
};
