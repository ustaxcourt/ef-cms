import { cypressEnv } from '../../../helpers/env/cypressEnvironment';

describe('Given a user with a DAWSON account', () => {
  describe('When they login in with the correct email and password', () => {
    it('Then they should be taken to their dashboard', () => {
      cy.visit('/login');
      // Login Button is Disabled till Enter Both Email and Password
      cy.get('[data-testid="login-button"]').should('be.disabled');
      cy.get('[data-testid="email-input"]').type('docketclerk1@example.com');
      cy.get('[data-testid="password-input"]').type(
        cypressEnv.defaultAccountPass,
        {
          log: false,
        },
      );
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="account-menu-button"]');
      cy.get('[data-testid="error-alert"]').should('not.exist');

      // after reloading they are still logged in
      cy.reload();
      cy.get('[data-testid="account-menu-button"]');
      cy.get('[data-testid="error-alert"]').should('not.exist');
      cy.url().should('contain', '/messages');

      // manually access url (still logged in)
      cy.visit('/trial-sessions');
      cy.get('[data-testid="header-text"]').should('contain', 'Trial Sessions');
      cy.url().should('contain', '/trial-sessions');
    });

    describe('And their account is unconfirmed', () => {
      it('Then they should be alerted that they have been sent an email to assist them with confirmation of their account', () => {
        // Login with unconfirmed account
      });
    });
  });

  describe('When they login with the correct email and an incorrect password', () => {
    it('Then they should be alerted that their username or password is incorrect', () => {
      // Login with email that has an account, wrong password
    });
  });

  describe('When they login with a misspelled email and correct password', () => {
    it('Then they should be alerted that their username or password is incorrect', () => {
      // Login with misspelled email that has an account, right password
    });
  });
});

describe('Given a user without a DAWSON account', () => {
  describe('When they login', () => {
    it('Then they should receive an error alerting them that their email or password is incorrect', () => {
      //* Login with email that does not have an account, wrong password
    });
  });
});

describe('Given a user who has been granted e-access to DAWSON', () => {
  describe('When they login with the correct email and temporary password', () => {
    it('Then they should be prompted to set a new password and be able to login to their account', () => {
      // * Login with force password change
    });
  });
});
