import { checkA11y } from '../../../../support/generalCommands/checkA11y';

describe('Trial Sessions - Public Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/trial-sessions');
    checkA11y();
  });
});
