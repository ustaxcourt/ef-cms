const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

let token;

describe('Trial Sessions UI Smoketests', () => {
  const { getUserToken, login } = getEnvironmentSpecificFunctions();

  before(async () => {
    let result = await getUserToken(
      'admissionsclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = result.AuthenticationResult.IdToken;
  });

  describe('login and view the trial sessions page', () => {
    it('should fetch the open trial sessions upon navigation', () => {
      login(token);
      cy.intercept({ method: 'GET', url: '**/trial-sessions' }).as(
        'getOpenTrialSessions',
      );
      cy.visit('/trial-sessions');
      cy.wait('@getOpenTrialSessions').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
      });
    });
  });
});
