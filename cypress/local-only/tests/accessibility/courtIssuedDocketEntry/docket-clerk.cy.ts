import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Court Issued Docket Entry - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk1();

    cy.visit(
      '/case-detail/110-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
    );
    cy.get('[data-testid="court-issued-docket-entry-title"]');

    checkA11y();
  });

  it('should be free of a11y issues when a Type B document exposes the judge selection and its validation error', () => {
    loginAsDocketClerk1();

    cy.visit(
      '/case-detail/110-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
    );
    cy.get('[data-testid="court-issued-docket-entry-title"]');

    selectTypeaheadInput(
      'court-issued-document-type-search',
      'Standing Scheduling Order',
    );
    cy.get('[data-testid="judge-select"]').should('exist');

    checkA11y();

    // Submitting without a judge renders the Type B validation error, which is
    // newly reachable state and must be checked as well. `Save Entry` is used
    // rather than `Save and Serve` because the seeded case is still in a `New`
    // status, so `canAllowDocumentServiceForCase` hides the serve button.
    cy.get('[data-testid="save-docket-entry-button"]').click();
    cy.contains('.usa-error-message', 'Select a judge').should('exist');

    checkA11y();
  });
});
