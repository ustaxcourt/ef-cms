import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import { getPetitionerNameInput } from '../../../local-only/support/pages/public/advanced-search';
import { isValidRequest } from '../../support/helpers';

describe('advanced search pages', () => {
  it('should allow the user to search for a case by petitioner name', () => {
    cy.visit('/');
    getPetitionerNameInput().type('Smith');
    cy.intercept('GET', '**/public-api/search?**').as(
      'getCaseByPetitionerName',
    );
    cy.get('button#advanced-search-button').click();
    cy.wait('@getCaseByPetitionerName').then(isValidRequest);
  });

  it('should display "No Matches Found" when case search yields no results', () => {
    cy.visit('/');
    cy.get('input#docket-number').type('99-21');
    cy.get('button#docket-search-button').click();

    cy.get('div#no-search-results').should('exist');
  });

  /*
    Only run this test against production as it relies on seed data existing.
    We cannot create the seed data for this test to pass as this is a read-only test.
  */
  if (getCypressEnv().env === 'prod') {
    it('should route to case detail when a case search by docket number match is found', () => {
      cy.visit('/');
      cy.get('input#docket-number').type('104-20');
      cy.get('button#docket-search-button').click();
      cy.get('[data-testid="header-public-case-detail"]').contains(
        'Docket Number: 104-20',
      );
      cy.get('[data-testid="table-public-docket-record"]');
    });
  }
});
