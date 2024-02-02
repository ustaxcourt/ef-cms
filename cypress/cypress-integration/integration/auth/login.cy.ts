import { v4 } from 'uuid';

describe('Given a user with a DAWSON account', () => {
  describe('When they login in with the correct email and password', () => {
    it('Then they should be taken to their dashboard', () => {
      // Login Button is Disabled till Enter Both Email and Password
      // Login correctly (happy path)
      // refresh (still on dashboard)
      // manually access url (still logged in)
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
      const emailWithoutAccount = `doesNotExist${v4()}@email.com`;
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(emailWithoutAccount);
      cy.get('[data-testid="password-input"]').type('Testing1234$', {
        log: false,
      });
      cy.get('[data-testid="login-button"]').click();
    });
  });
});

describe('Given a user who has been granted e-access to DAWSON', () => {
  describe('When they login with the correct email and temporary password', () => {
    it('Then they should be prompted to set a new password and be able to login to their account', () => {
      // todo
    });
  });
});
