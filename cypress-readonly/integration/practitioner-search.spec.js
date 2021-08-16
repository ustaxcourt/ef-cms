const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

let token;

describe('Practitioner Search', () => {
  const { getUserToken, login } = getEnvironmentSpecificFunctions();

  before(async () => {
    let result = await getUserToken(
      'admissionsclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = result.AuthenticationResult.IdToken;
  });

  it('should do a practitioner search', () => {
    login(token);
    cy.visit('/search');
    cy.get('button#tab-practitioner').click();
    cy.intercept({ method: 'GET', url: '**/practitioner**' }).as(
      'getPractitionerByName',
    );
    cy.get('input#practitioner-name').type('Smith');
    cy.get('button#practitioner-search-by-name-button').click();
    cy.wait('@getPractitionerByName').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
    });
  });
});
