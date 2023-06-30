import { AuthenticationResult } from '../../support/login-types';
import { isValidRequest } from '../support/helpers';
import { login } from '../support/pages/login';

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Practitioner Search', () => {
  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'testAdmissionsClerk@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      login(result.AuthenticationResult.IdToken);
    });
  });

  it('should do a practitioner search by name', () => {
    cy.get('.advanced').contains('Advanced').click();

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
