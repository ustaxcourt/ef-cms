import { checkA11y } from '../../../../support/generalCommands/checkA11y';

describe('Todays Orders - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/todays-orders');
    cy.get('.todays-orders').should('exist');

    checkA11y();
  });
});
