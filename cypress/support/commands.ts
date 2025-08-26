import '../support/commands/keepAliases';
import 'cypress-file-upload';

before(() => {
  // Only intercept requests to our own API. cy.intercept() will cause file corruption errors on upload if s3 requests are intercepted.
  cy.intercept('https://*api-*.*.*.*/**', req => {
    req.headers['x-test-user'] = 'true';
  });
});

beforeEach(() => {
  cy.intercept('https://*api-*.*.*.*/**', req => {
    req.headers['x-test-user'] = 'true';
  });
});
