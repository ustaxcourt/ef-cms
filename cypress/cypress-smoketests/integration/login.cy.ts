import { createAPetitioner } from '../../helpers/create-a-petitioner';
import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { cypressEnv } from '../../helpers/env/cypressEnvironment';
import { faker } from '@faker-js/faker';
import { logout } from '../../helpers/auth/logout';
import { v4 } from 'uuid';
import { verifyPetitionerAccount } from '../../helpers/verify-petitioner-account';

describe('Given a user with a DAWSON account', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

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
      it('Then they should be alerted that they need to confirm their account via a confirmation e-mail', () => {
        const unconfirmedEmail = `cypress_test_account+${v4()}@example.com`;
        createAPetitioner({
          email: unconfirmedEmail,
          name: 'Person mcDerson',
          password: 'Testing1234$',
        });
        cy.visit('/login');
        cy.get('[data-testid="email-input"]').type(unconfirmedEmail);
        cy.get('[data-testid="password-input"]').type(
          cypressEnv.defaultAccountPass,
          {
            log: false,
          },
        );
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="error-alert"]').should(
          'contain',
          'Email address not verified',
        );
      });
    });
  });

  describe('When they login with the correct email and an incorrect password', () => {
    it('Then they should be alerted that their username or password is incorrect', () => {
      const username = `cypress_test_account+${v4()}`;
      const email = `${username}@example.com`;
      const password = 'Testing1234$';
      const name = faker.person.fullName();
      createAPetitioner({ email, name, password });
      verifyPetitionerAccount({ email });

      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="password-input"]').type(`${password}_MISSPELLED`, {
        log: false,
      });
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="error-alert"]').should(
        'contain',
        'The email address or password you entered is invalid',
      );
    });
  });

  describe('When they login with a misspelled email and correct password', () => {
    it('Then they should be alerted that their username or password is incorrect', () => {
      const username = `cypress_test_account+${v4()}`;
      const email = `${username}@example.com`;
      const password = 'Testing1234$';
      const name = faker.person.fullName();
      createAPetitioner({ email, name, password });
      verifyPetitionerAccount({ email });

      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(`${email}_MISSPELLED`);
      cy.get('[data-testid="password-input"]').type(password, {
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
  describe('When they login', () => {
    it('Then they should receive an error alerting them that their email or password is incorrect', () => {
      const emailWithoutAccount = `doesNotExist${v4()}@example.com`;

      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(emailWithoutAccount);
      cy.get('[data-testid="password-input"]').type('does_not_matter', {
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

describe('Given a user who has been granted e-access to DAWSON', () => {
  describe('When they login with the correct email and temporary password', () => {
    it('Then they should be prompted to set a new password and be able to login to their account', () => {
      const practitionerUserName = `cypress_test_account+${v4()}`;
      const practitionerEmail = `${practitionerUserName}@example.com`;

      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.login('admissionsclerk1');
        cy.get('[data-testid="messages-banner"]');
        cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-parties"]').click();
        cy.get('[data-testid="edit-petitioner"]').click();
        cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
          practitionerEmail,
        );
        cy.get('[data-testid="internal-confirm-petitioner-email-input"]').type(
          practitionerEmail,
        );
        cy.get(
          '[data-testid="submit-edit-petitioner-information-button"]',
        ).click();

        cy.get('[data-testid="modal-button-confirm"]').click();

        cy.get('[data-testid="success-alert"]').contains('Changes saved');

        logout();
      });

      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(practitionerEmail);
      cy.get('[data-testid="password-input"]').type('Testing1234$', {
        log: false,
      });
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="new-password-input"]').type('Testing1234$');
      cy.get('[data-testid="confirm-new-password-input"]').type('Testing1234$');
      cy.get('[data-testid="change-password-button"]').click();

      cy.get('[data-testid="my-cases-link"]');
    });
  });
});
