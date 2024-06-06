import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Create Practitioner - Admissions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('/users/create-practitioner');
    cy.get('[data-testid="create-practitioner-button"]');

    cy.runA11y();
  });
});
