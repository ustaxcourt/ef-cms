import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Before Starting Case - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();

    cy.visit('/before-filing-a-petition');
    cy.get('[data-testid="go-to-step-1"]').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });
});
