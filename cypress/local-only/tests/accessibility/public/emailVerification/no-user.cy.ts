import { impactLevel } from '../../../../../helpers/accessibility-impact';
import { terminalLog } from '../../../../../helpers/cypressTasks/logs';

describe('Email Verification - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/email-verification-instructions');
    cy.contains('Log In').should('exist');

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
