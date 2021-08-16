const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

let token;

describe('Document QC UI Smoketests', () => {
  const { getUserToken, login } = getEnvironmentSpecificFunctions();

  before(async () => {
    let result = await getUserToken(
      'admissionsclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = result.AuthenticationResult.IdToken;
  });

  describe('login and view the document QC page', () => {
    before(() => {
      login(token);
    });

    it("should fetch the user's inbox upon navigation", () => {
      cy.intercept({ method: 'GET', url: '**/document-qc/my/inbox' }).as(
        'getMyInbox',
      );
      cy.visit('/document-qc/my/inbox');
      cy.wait('@getMyInbox').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
      });
    });
  });
});
