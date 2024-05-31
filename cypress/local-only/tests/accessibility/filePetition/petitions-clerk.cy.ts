import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('File a petition - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Step 1', () => {
    it('should be free of a11y issues on statistics section', () => {
      loginAsPetitionsClerk();
      cy.visit('/file-a-petition/step-1');
      cy.get('#tab-irs-notice').click();
      cy.get('#has-irs-verified-notice-yes').click();
      cy.get('#date-of-notice-picker').should('exist');
      cy.get('#case-type').select('Deficiency');
      cy.get('.statistic-form').should('exist');

      cy.injectAxe();
      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues on irs notice modal', () => {
      loginAsPetitionsClerk();
      cy.visit('/file-a-petition/step-1');
      cy.get('#tab-irs-notice').click();
      cy.get('#has-irs-verified-notice-yes').click();
      cy.get('#date-of-notice-picker').should('exist');
      cy.get('#case-type').select('Deficiency');
      cy.get('.calculate-penalties').click();
      cy.get('.modal-screen').should('exist');

      cy.injectAxe();
      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });
});
