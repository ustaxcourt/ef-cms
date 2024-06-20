import { checkA11y } from '../../../support/generalCommands/checkA11y';
import {
  loginAsDocketClerk,
  loginAsDocketClerk1,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Confirm Initiate Service Modal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk1();

    cy.visit(
      '/case-detail/107-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
    );
    cy.get('[data-testid="court-issued-docket-entry-title"]');
    cy.get('[data-testid="judge-select"]').select('Colvin');
    cy.get('[data-testid="document-description-input"]').type('Anything');
    cy.get('[data-testid="serve-to-parties-btn"]').click();
    cy.get('[data-testid="confirm-initiate-service-modal"]');

    checkA11y();
  });

  describe('Multi-docketable filings', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/111-19');
      cy.get('[data-testid="docket-record-table"]');
      cy.get('[data-testid="document-viewer-link-A"]').click();
      cy.get('[data-testid="serve-paper-filed-document"]').click();
      cy.get('[data-testid="confirm-initiate-service-modal"]');

      checkA11y();
    });
  });
});
