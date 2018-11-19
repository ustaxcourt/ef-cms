module.exports = {
  extends: ['prettier', 'eslint:recommended', 'plugin:security/recommended'],
  plugins: ['prettier', 'security'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-useless-escape': 'off',
    'indent': ['error', 2],
    'dot-notation': 'error',
    'dot-location': ["error", "property"]
  },
  env: {
    es6: true,
    mocha: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
};
