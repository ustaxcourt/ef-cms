import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Add/Edit Practitioner Document - Admissions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('/practitioner-detail/PT1234/add-document');
    cy.get('[data-testid="add-edit-practitioner-document-header"]');

    checkA11y();
  });
});
