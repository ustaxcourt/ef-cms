import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Advanced Search - Petition Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues when searching by practitioner name', () => {
    loginAsPetitionsClerk();
    cy.visit('/search');
    cy.get('[data-testid="practitioner-search-tab"]').click();
    cy.get('#practitioner-name').type('test');
    cy.get('#practitioner-search-by-name-button').click();
    cy.get('.search-results').should('exist');

    checkA11y();
  });
});
