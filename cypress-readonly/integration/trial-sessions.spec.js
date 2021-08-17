const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const { isValidRequest } = require('../support/helpers');

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Trial Sessions UI Smoketests', () => {
  let token;

  const { getUserToken, login } = getEnvironmentSpecificFunctions();

  before(async () => {
    let result = await getUserToken(
      'testAdmissionsClerk@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = result.AuthenticationResult.IdToken;
  });

  describe('login and view the trial sessions page', () => {
    it('should fetch the open trial sessions upon navigation', () => {
      login(token);

      cy.intercept({
        hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
        method: 'GET',
        url: '/trial-sessions',
      }).as('getOpenTrialSessions');

      cy.visit('/trial-sessions');

      cy.wait('@getOpenTrialSessions').then(isValidRequest);
    });
  });
});
