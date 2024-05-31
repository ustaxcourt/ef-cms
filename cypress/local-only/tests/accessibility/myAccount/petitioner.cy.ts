import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('My Account Page - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();
    cy.visit('/my-account');
    cy.contains('Login & Service Email Address');

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

  it('should be free of a11y issues when changing email', () => {
    loginAsPetitioner();
    cy.visit('/change-login-and-service-email');
    cy.get('[data-testid="change-login-email-input"]').should('exist');

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
