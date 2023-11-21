import { isValidRequest } from '../../support/helpers';

const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('advanced search pages', () => {
  it('should allow the user to search for a case by petitioner name', () => {
    cy.visit('/');
    cy.get('input#petitioner-name').type('Smith');

    cy.intercept({
      hostname: `public-api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/public-api/search?**',
    }).as('getCaseByPetitionerName');

    cy.get('button#advanced-search-button').click();

    cy.wait('@getCaseByPetitionerName').then(isValidRequest);
  });

  it('should display "No Matches Found" when case search yields no results', () => {
    cy.visit('/');
    cy.get('input#docket-number').type('99-21');
    cy.get('button#docket-search-button').click();

    cy.get('div#no-search-results').should('exist');
  });

  it('should route to case detail when a case search by docket number match is found', () => {
    cy.visit('/');
    cy.get('input#docket-number').type('104-20');
    cy.get('button#docket-search-button').click();
    cy.get('table#docket-record-table tr:contains("Petition")').should('exist');
    cy.get('table#docket-record-table tr:contains("Petition") button').should(
      'not.exist',
    );
  });
});
