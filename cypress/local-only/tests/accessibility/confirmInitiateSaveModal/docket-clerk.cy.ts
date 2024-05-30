import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Confirm Initiate Service Modal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk1();

    cy.visit(
      '/case-detail/111-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
    );
    cy.get('[data-testid="court-issued-docket-entry-title"]');
    cy.get('[data-testid="document-description-input"]').type('Anything');
    cy.get(
      '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
    ).type('01/01/2022');
    cy.get('[data-testid="save-docket-entry-button"]').click();
    cy.get('[data-testid="confirm-initiate-save-modal"]');

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
