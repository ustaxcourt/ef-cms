import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Edit Practitioner - Admissions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('/users/edit-practitioner/PT1234');
    cy.get('[data-testid="save-practitioner-updates-button"]');

    checkA11y();
  });
});
