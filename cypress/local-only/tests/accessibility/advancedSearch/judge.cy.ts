import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('Advanced Search - Judge Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvin();

    cy.visit('/search');
    cy.get('[data-testid="case-search-by-name-container"]').should('exist');

    checkA11y();
  });

  it('should be free of a11y issues when no matches', () => {
    loginAsColvin();

    cy.visit('/search/no-matches');
    cy.get('[data-testid="search-by-name-link"]').should('exist');

    checkA11y();
  });

  it('should be free of a11y issues when searching by petitioner name', () => {
    loginAsColvin();

    cy.visit('/search');
    cy.get('#petitioner-name').type('cairo');
    cy.get('#advanced-search-button').click();
    cy.get('.search-results').should('exist');

    checkA11y();
  });

  it('should be free of a11y issues when searching by practitioner name', () => {
    loginAsColvin();

    cy.visit('/search');
    cy.get('[data-testid="practitioner-search-tab"]').click();
    cy.get('#practitioner-name').type('test');
    cy.get('#practitioner-search-by-name-button').click();
    cy.get('.search-results').should('exist');

    checkA11y();
  });
});
