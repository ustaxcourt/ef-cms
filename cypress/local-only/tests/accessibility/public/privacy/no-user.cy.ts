import { checkA11y } from '../../../../support/generalCommands/checkA11y';

describe('Privacy - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/privacy');
    cy.contains('Privacy').should('exist');

    checkA11y();
  });
});
