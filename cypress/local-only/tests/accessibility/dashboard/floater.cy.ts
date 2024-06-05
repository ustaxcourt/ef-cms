import { loginAsFloater } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard - Floater Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsFloater();

    cy.runA11y();
  });
});
