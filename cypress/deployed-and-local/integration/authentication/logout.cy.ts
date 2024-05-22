import { loginAsDocketClerk1 } from '../../../helpers/authentication/login-as-helpers';

describe('logout', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  /*
    Given a user is logged in to DAWSON on a desktop
    When the user clicks logout
    Then they should be taken to the login page
    */
  it('should route the user to the /login page after they logout', () => {
    loginAsDocketClerk1();
    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="logout-button-desktop"]').click();
    cy.get('[data-testid="login-header"]');
    cy.reload();
    cy.get('[data-testid="login-header"]');
    cy.url().should('contain', '/login');
  });

  /*
    Given a user is logged in to DAWSON on a desktop
    When the user clicks logout
    And they try to access a case directly as a URL
    Then they should be taken to the login page
    */
  it('should not allow a user to directly access a protected route after they logout', () => {
    loginAsDocketClerk1();
    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="logout-button-desktop"]').click();
    cy.get('[data-testid="login-header"]');
    cy.visit('/trial-sessions');
    cy.get('[data-testid="login-header"]');
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
