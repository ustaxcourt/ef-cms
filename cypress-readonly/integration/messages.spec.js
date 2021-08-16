const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

let token;

describe('UI Smoketests', () => {
  const { getUserToken, login } = getEnvironmentSpecificFunctions();

  before(async () => {
    let result = await getUserToken(
      'admissionsclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = result.AuthenticationResult.IdToken;
  });

  describe('login and view the user messages', () => {
    it("should fetch the user's messages after log in", () => {
      login(token);
      cy.intercept({ method: 'GET', url: '**/messages/my/inbox' }).as(
        'getMyMessages',
      );
      cy.visit('/messages/my/inbox');
      cy.wait('@getMyMessages').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
      });
    });
  });
});
