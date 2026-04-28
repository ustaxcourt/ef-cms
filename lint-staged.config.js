module.exports = {
  '{shared,web-client}/**/*.{css,scss}': ['stylelint'],
  '{scripts,shared,web-api,web-client}/**/*.{js,jsx,ts,tsx}': ['eslint'],
  '{scripts,shared,web-api,web-client}/**/*.sh': ['lint-staged-shellcheck'],
  'swagger.json,v1.yaml,v2.yaml': ['swagger-cli validate'],
};
