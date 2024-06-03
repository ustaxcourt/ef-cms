import { isValidRequest } from '../../support/helpers';
import { loginAsAdmissionsClerk } from '../../../helpers/authentication/login-as-helpers';

const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Practitioner Search', () => {
  it('should do a practitioner search by name and bar number', () => {
    loginAsAdmissionsClerk('testAdmissionsClerk');

    cy.get('.advanced').contains('Advanced').click();

    cy.get('[data-testid="practitioner-search-tab"]').click();

    cy.intercept({
      hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/practitioners**',
    }).as('getPractitionerByName');

    cy.get('input#practitioner-name').type('Smith');

    cy.get('button#practitioner-search-by-name-button').click();

    cy.wait('@getPractitionerByName').then(isValidRequest);

    cy.get('[data-testid="practitioner-search-tab"]').click();

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
