const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const { isValidRequest } = require('../support/helpers');

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Document QC UI Smoketests', () => {
  let token;

  const { getUserToken, login } = getEnvironmentSpecificFunctions();

  before(async () => {
    let result = await getUserToken(
      'testAdmissionsClerk@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = result.AuthenticationResult.IdToken;
  });

  describe('login and view the document QC page', () => {
    it("should fetch the user's inbox upon navigation", () => {
      login(token);

      cy.intercept({
        hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
        method: 'GET',
        url: '/sections/admissions/document-qc/inbox*',
      }).as('getSectionInbox');

      cy.visit('/document-qc/section/inbox');

      cy.wait('@getSectionInbox').then(isValidRequest);
    });
  });
});
