const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const { isValidRequest } = require('../support/helpers');

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Messages UI Smoketests', () => {
  let token;

  const { getUserToken, login } = getEnvironmentSpecificFunctions();

  before(async () => {
    let result = await getUserToken(
      'testAdmissionsClerk@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = result.AuthenticationResult.IdToken;
  });

  describe('login and view the user messages', () => {
    it("should fetch the user's messages after log in", () => {
      cy.intercept({
        hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
        method: 'GET',
        url: '/messages/inbox/*',
      }).as('getMyMessages');

      login(token);

      cy.wait('@getMyMessages').then(isValidRequest);
    });

    it('should fetch the section inbox messages after clicking the switch section button', () => {
      cy.intercept({
        hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
        method: 'GET',
        url: '/messages/inbox/section/admissions',
      }).as('getSectionInbox');

      cy.get('a.button-switch-box').click();

      cy.wait('@getSectionInbox').then(isValidRequest);
    });
  });
});
