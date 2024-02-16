import { cypressEnv } from '../../helpers/env/cypressEnvironment';

describe('Given a user with a DAWSON account', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('When they login in with the correct email and password', () => {
    it('Then they should be taken to their dashboard', () => {
      cy.visit('/login');
      // Login Button is Disabled till Enter Both Email and Password
      cy.get('[data-testid="login-button"]').should('be.disabled');
      cy.get('[data-testid="email-input"]').type(
        'testAdmissionsClerk@example.com',
      );
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
  });

  describe('When they login with a correct email and an misspelled password', () => {
    it('Then they should be alerted that their username or password is incorrect', () => {
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(
        'testAdmissionsClerk@example.com',
      );
      cy.get('[data-testid="password-input"]').type('testing1234$', {
        log: false,
      });
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="error-alert"]').should(
        'contain',
        'The email address or password you entered is invalid',
      );
    });
  });
});

describe('Given a user without a DAWSON account', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('When they login', () => {
    it('Then they should be alerted that their username or password is incorrect', () => {
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('doesNotExist@example.com');
      cy.get('[data-testid="password-input"]').type(
        cypressEnv.defaultAccountPass,
        {
          log: false,
        },
      );
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="error-alert"]').should(
        'contain',
        'The email address or password you entered is invalid',
      );
    });
  });
});
