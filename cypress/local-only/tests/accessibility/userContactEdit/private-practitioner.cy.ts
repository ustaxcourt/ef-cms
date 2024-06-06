import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('User Contact Edit Page - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPrivatePractitioner();
    cy.visit('/user/contact/edit');
    cy.get('[data-testid="save-edit-contact"]').should('exist');

    cy.runA11y();
  });
});
