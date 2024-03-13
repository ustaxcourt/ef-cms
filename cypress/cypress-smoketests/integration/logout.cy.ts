import { loginAsDocketClerk1 } from '../../helpers/auth/login-as-helpers';

describe('logout', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  /*
  Given a user is logged in to DAWSON on a mobile device
  When the user clicks logout
  Then they should be taken to the login page
  */
  it('should route the user to the /login page after they logout on a mobile device', () => {
    cy.viewport('iphone-6');
    loginAsDocketClerk1();
    cy.get('[data-testid="account-menu-button-mobile"]').click();
    cy.get('[data-testid="logout-button-mobile"]').click();
    cy.get('[data-testid="login-header"]');
    cy.reload();
    cy.get('[data-testid="login-header"]');
    cy.url().should('contain', '/login');
  });
});
