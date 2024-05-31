import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Case Detail Internal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Docket record tab', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-number-header"]');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });

  describe('Case information tab', () => {
    describe('Case history tab', () => {
      it('should be free of a11y issues', () => {
        loginAsDocketClerk();

        cy.visit('/case-detail/101-19');
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="case-status-history-tab"]').click();
        cy.get('[data-testid="case-status-history-container"]');

        cy.injectAxe();

        cy.checkA11y(
          undefined,
          {
            includedImpacts: impactLevel,
            rules: {
              'nested-interactive': { enabled: false }, // TODO LINK
            },
          },
          terminalLog,
        );
      });
    });
  });

  describe('Case messages tab', () => {
    it('message detail - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit(
        '/messages/104-19/message-detail/2d1191d3-4597-454a-a2b2-84e267ccf01e',
      );
      cy.get('[data-testid="message-detail-container"]');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });
});
