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

    describe('Document view tab', () => {
      it('should be free of a11y issues', () => {
        loginAsDocketClerk();

        cy.visit(
          '/case-detail/103-19/document-view?docketEntryId=f1aa4aa2-c214-424c-8870-d0049c5744d7',
        );
        cy.get('[data-testid="document-view-container"]');

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

      it('sealed case - should be free of a11y issues', () => {
        loginAsDocketClerk();

        cy.visit(
          '/case-detail/105-20/document-view?docketEntryId=af9e2d43-1255-4e3d-80d0-63f0aedfab5a',
        );
        cy.get('[data-testid="document-view-container"]');

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
