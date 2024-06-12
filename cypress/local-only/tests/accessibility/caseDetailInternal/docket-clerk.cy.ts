import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Detail Internal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Docket record tab', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-number-header"]');

      checkA11y();
    });

    describe('Document view tab', () => {
      it('should be free of a11y issues', () => {
        loginAsDocketClerk();

        cy.visit(
          '/case-detail/103-19/document-view?docketEntryId=f1aa4aa2-c214-424c-8870-d0049c5744d7',
        );
        cy.get('[data-testid="document-view-container"]');

        checkA11y();
      });

      it('sealed case - should be free of a11y issues', () => {
        loginAsDocketClerk();

        cy.visit(
          '/case-detail/105-20/document-view?docketEntryId=af9e2d43-1255-4e3d-80d0-63f0aedfab5a',
        );
        cy.get('[data-testid="document-view-container"]');

        checkA11y();
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

        checkA11y();
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

      checkA11y();
    });
  });
});
