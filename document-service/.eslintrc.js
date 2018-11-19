module.exports = {
  extends: ['prettier', 'eslint:recommended', 'plugin:security/recommended'],
  plugins: ['prettier', 'security'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-useless-escape': 'off',
  },
  env: {
    es6: true,
    mocha: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 8,
  },
};
