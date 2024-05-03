import { isValidRequest } from '../../support/helpers';
import { loginAsDocketClerk1 } from '../../../helpers/authentication/login-as-helpers';

const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Practitioner Search', () => {
  it('should do a practitioner search by name and bar number', () => {
    loginAsDocketClerk1();
    cy.get('.advanced').contains('Advanced').click();
    cy.get('[data-testid="tab-practitioner"]').click();

    cy.intercept({
      hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/practitioners**',
    }).as('getPractitionerByName');

    cy.get('[data-testid="practitioner-name-input"]').type('Smith');
    cy.get('[data-testid="practitioner-search-by-name-button"]').click();
    cy.wait('@getPractitionerByName').then(isValidRequest);
    cy.get('[data-testid="practitioner-results-table"]')
      .find('tr')
      .then(row => {
        return row.length > 0;
      });
    cy.get('[data-testid="practitioner-search-result-count"]').should('exist');
  });

  it('should do a practitioner search by bar number', () => {
    loginAsDocketClerk1();
    cy.get('.advanced').contains('Advanced').click();
    cy.get('[data-testid="tab-practitioner"]').click();

    cy.intercept({
      hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/practitioners/test',
    }).as('getPractitionerByBarNumber');

    cy.get('[data-testid="bar-number-search-input"]').type('Smith');
    cy.get('[data-testid="practitioner-search-by-bar-number-button"]').click();
    cy.wait('@getPractitionerByBarNumber').then(isValidRequest);
  });
});
