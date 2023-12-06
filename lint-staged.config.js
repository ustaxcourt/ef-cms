module.exports = {
  '*.{css,scss}': ['stylelint'],
  '*.{js,jsx,ts,tsx}': ['eslint'],
  '*.{sh}': ['lint-staged-shellcheck'],
  'pa11y-*.js': ['node lint-pa11y.js'],
  'swagger.json,v1.yaml,v2.yaml': ['swagger-cli validate'],
};
