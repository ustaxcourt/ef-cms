import { createAPetitioner } from '../../helpers/create-a-petitioner';
import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { getCypressEnv } from '../../helpers/env/cypressEnvironment';
import { logout } from '../../helpers/auth/logout';
import { v4 } from 'uuid';

describe('login', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  /*
      Given a user with a DAWSON account
      When they login in with the correct email and password
      And their account is unconfirmed
      Then they should be alerted that they need to confirm their account via a confirmation e-mail
    */
  it('should display an alert to confirm user account when an unconfirmed account attempts to login', () => {
    const unconfirmedEmail = `cypress_test_account+${v4()}@example.com`;
    createAPetitioner({
      email: unconfirmedEmail,
      name: 'Person mcDerson',
      password: getCypressEnv().defaultAccountPass,
    });
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(unconfirmedEmail);
    cy.get('[data-testid="password-input"]').type(
      getCypressEnv().defaultAccountPass,
    );
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="error-alert"]').should(
      'contain',
      'Email address not verified',
    );
  });

  /*
      Given a user with a DAWSON account
      When they login with the correct email and an incorrect password
      Then they should be alerted that their username or password is incorrect
  */
  it('should give an error alert when the password is incorrect', () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('docketclerk1@example.com');
    cy.get('[data-testid="password-input"]').type('totallyIncorrectPassword');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="error-alert"]').should(
      'contain',
      'The email address or password you entered is invalid',
    );
  });

  /*
      Given en granted e-access to DAWSON
      When they login with tha user who has bee correct email and temporary password
      Then they should be prompted to set a new password and be able to login to their account
  */
  it('should prompt the user to change their password when they have been granted e-access', () => {
    const practitionerUserName = `cypress_test_account+${v4()}`;
    const practitionerEmail = `${practitionerUserName}@example.com`;

    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.login('admissionsclerk1');
      cy.get('[data-testid="messages-banner"]');
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="edit-petitioner-button"]').click();
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
    cy.get('[data-testid="password-input"]').type(
      getCypressEnv().defaultAccountPass,
    );
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="new-password-input"]').type(
      getCypressEnv().defaultAccountPass,
    );
    cy.get('[data-testid="confirm-new-password-input"]').type(
      getCypressEnv().defaultAccountPass,
    );
    cy.get('[data-testid="change-password-button"]').click();

    cy.get('[data-testid="my-cases-link"]');
  });
});
