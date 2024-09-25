import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

describe('File Document Page - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();
    cy.visit('/case-detail/101-19/file-a-document');
    cy.get('[data-testid="complete-doc-document-type-search"]').should('exist');

    checkA11y();
  });

  it('should be free of a11y issues on step 2', () => {
    loginAsPetitioner();
    cy.visit('/case-detail/101-19/file-a-document');
    selectTypeaheadInput(
      'complete-doc-document-type-search',
      'Motion for Leave to File Out of Time',
    );

    selectTypeaheadInput(
      'secondary-doc-secondary-document-type',
      'Motion for Continuance',
    );

    cy.get('#submit-document').click();
    cy.get('#primaryDocument-certificateOfService-label').click();
    cy.get('#primaryDocument-service-date-picker').should('exist');

    checkA11y();
  });
});
