import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Confirm Initiate Save Modal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit(
      '/case-detail/111-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
    );
    cy.get(
      '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
    ).type('01/01/2022');
    cy.get('[data-testid="save-docket-entry-button"]').click();
    cy.get('[data-testid="confirm-initiate-save-modal"]');

    checkA11y();
  });
});
