import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();

    cy.runA11y();
  });

  it('should be free of a11y issues when viewing payment options', () => {
    loginAsPetitioner();
    cy.get('.payment-options').click();
    cy.get('a.usa-link--external').should('exist');

    cy.runA11y();
  });
});
