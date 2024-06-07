import { loginAsReportersOffice } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard Page - Reporters Office Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsReportersOffice();

    cy.runA11y();
  });
});
