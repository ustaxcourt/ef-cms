import { checkA11y } from '../../../../support/generalCommands/checkA11y';

describe('Email Verification - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/email-verification-instructions');
    cy.contains('Log In').should('exist');

    checkA11y();
  });
});
