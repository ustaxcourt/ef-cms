import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Advanced Search', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('Case - should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('search');
    cy.get('[data-testid="case-search-by-name-container"]').should('exist');
    cy.get('[data-testid="footer-misuse-warning-text"]').should('exist');

    cy.runA11y();
  });

  it('Order - should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('/search');
    cy.get('[data-testid="order-search-tab"]').click();
    cy.get('[data-testid="order-search-container"]').should('exist');

    cy.runA11y();
  });

  it('Opinion - should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('/search');
    cy.get('[data-testid="opinion-search-tab"]').click();
    cy.get('[data-testid="opinion-search-container"]').should('exist');

    cy.runA11y();
  });

  it('Practitioner - should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('/search');
    cy.get('[data-testid="practitioner-search-tab"]').click();
    cy.get('[data-testid="practitioner-search-container"]').should('exist');

    cy.runA11y();
  });
});
