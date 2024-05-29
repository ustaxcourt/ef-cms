import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Edit Petitioner Information - Admissions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit(
      '/case-detail/124-20/edit-petitioner-information/d2fadb14-b0bb-4019-b6b1-cb51cb1cb92f',
    );
    cy.get('[data-testid="edit-petitioner-contact-type-select"]');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });

  describe('Matching Email Found Modal', () => {
    it('should be free of a11y issues', () => {
      loginAsAdmissionsClerk();

      cy.visit(
        '/case-detail/124-20/edit-petitioner-information/d2fadb14-b0bb-4019-b6b1-cb51cb1cb92f',
      );
      cy.get('[data-testid="edit-petitioner-contact-type-select"]');
      cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
        'petitioner1@example.com',
      );
      cy.get('[data-testid="internal-confirm-petitioner-email-input"]').type(
        'petitioner1@example.com',
      );
      cy.get(
        '[data-testid="submit-edit-petitioner-information-button"]',
      ).click();
      cy.get('[data-testid="matching-email-found-modal"]');

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

  describe('No Matching Email Found Modal', () => {
    it('should be free of a11y issues', () => {
      loginAsAdmissionsClerk();

      cy.visit(
        '/case-detail/124-20/edit-petitioner-information/d2fadb14-b0bb-4019-b6b1-cb51cb1cb92f',
      );
      cy.get('[data-testid="edit-petitioner-contact-type-select"]');
      cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
        'available@example.com',
      );
      cy.get('[data-testid="internal-confirm-petitioner-email-input"]').type(
        'available@example.com',
      );
      cy.get(
        '[data-testid="submit-edit-petitioner-information-button"]',
      ).click();
      cy.get('[data-testid="no-matching-email-found-modal"]');

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
});
