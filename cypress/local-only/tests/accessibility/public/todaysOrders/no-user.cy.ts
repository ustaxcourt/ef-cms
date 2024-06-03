import { impactLevel } from '../../../../../helpers/accessibility-impact';
import { terminalLog } from '../../../../../helpers/cypressTasks/logs';

describe('Todays Orders - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/todays-orders');
    cy.get('.todays-orders').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
        },
      },
      terminalLog,
    );
  });
});
