import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard Page - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPrivatePractitioner();

    cy.runA11y();
  });

  it('should be free of a11y issues when viewing closed cases tab', () => {
    loginAsPrivatePractitioner();
    cy.get('#tab-closed').click();

    cy.runA11y();
  });
});
