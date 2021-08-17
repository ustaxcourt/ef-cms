const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const { isValidRequest } = require('../support/helpers');

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Practitioner Search', () => {
  let token;

  const { getUserToken, login } = getEnvironmentSpecificFunctions();

  before(async () => {
    let result = await getUserToken(
      'testAdmissionsClerk@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = result.AuthenticationResult.IdToken;
  });

  before(() => {
    login(token);
  });

  it('should do a practitioner search by name', () => {
    cy.visit('/search');

    cy.get('button#tab-practitioner').click();

    cy.intercept({
      hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/practitioners**',
    }).as('getPractitionerByName');

    cy.get('input#practitioner-name').type('Smith');

    cy.get('button#practitioner-search-by-name-button').click();

    cy.wait('@getPractitionerByName').then(isValidRequest);
  });

  it('should do a practitioner search by bar number', () => {
    cy.get('button#tab-practitioner').click();

    cy.intercept({
      hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/practitioners/Smith',
    }).as('getPractitionerByBarNumber');

    cy.get('input#bar-number').type('Smith');

    cy.get('button#practitioner-search-by-bar-number-button').click();

    cy.wait('@getPractitionerByBarNumber').then(isValidRequest);
  });
});
