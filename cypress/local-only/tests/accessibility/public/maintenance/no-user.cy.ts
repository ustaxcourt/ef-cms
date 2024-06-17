import { checkA11y } from '../../../../support/generalCommands/checkA11y';

describe('Maintenance - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/maintenance');
    cy.get('[data-testid="maintenance-container"]').should('exist');

    checkA11y();
  });
});
