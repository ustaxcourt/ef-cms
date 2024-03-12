import { DEFAULT_FORGOT_PASSWORD_CODE } from '../../support/cognito-login';
import { createAPetitioner } from '../../helpers/create-a-petitioner';
import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { faker } from '@faker-js/faker';
import { getCypressEnv } from '../../helpers/env/cypressEnvironment';
import { logout } from '../../helpers/auth/logout';
import { v4 } from 'uuid';
import { verifyPasswordRequirements } from '../../helpers/auth/verify-password-requirements';
import { verifyPetitionerAccount } from '../../helpers/verify-petitioner-account';

describe('Forgot Password', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });
  const password = getCypressEnv().defaultAccountPass;

  it('should alert a user exactly the same way as an associated DAWSON email when they enter an unassociated DAWSON email into forgot password(security concern)', () => {
    cy.visit('/login');
    cy.get('[data-testid="forgot-password-button"]').click();
    cy.get('[data-testid="email-input"]').clear();
    const emailWithoutAccount = `doesNotExist${v4()}@email.com`;
    cy.get('[data-testid="email-input"]').type(emailWithoutAccount);
    cy.get('[data-testid="send-password-reset-button"]').click();
    cy.get('[data-testid="success-alert"]').should(
      'contain',
      'Password reset code sent',
    );
  });

  it('should alert a user that that they have been sent an email to assist them with the confirmation of their account when they enter an email address that is an unconfirmed account', () => {
    const username = `cypress_test_account+${v4()}`;
    const email = `${username}@example.com`;
    const name = faker.person.fullName();
    createAPetitioner({ email, name, password });
    cy.visit('/login');
    cy.get('[data-testid="forgot-password-button"]').click();
    cy.get('[data-testid="email-input"]').clear();
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="send-password-reset-button"]').click();
    cy.get('[data-testid="warning-alert"]').should(
      'contain',
      'We’ve sent you an email',
    );
  });

  it('should allow a user to login with their existing password if they have indicated they forgot their password and have not clicked the verification email', () => {
    const username = `cypress_test_account+${v4()}`;
    const email = `${username}@example.com`;
    const name = faker.person.fullName();
    createAPetitioner({ email, name, password });
    verifyPetitionerAccount({ email });

    cy.get('[data-testid="forgot-password-button"]').click();
    cy.get('[data-testid="email-input"]').clear();
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="send-password-reset-button"]').click();

    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="my-cases-link"]');
  });

  it('should reset a users password and log them in when they indicate they have forgotten their password and click on the email verfication link', () => {
    const username = `cypress_test_account+${v4()}`;
    const email = `${username}@example.com`;
    const name = faker.person.fullName();
    createAPetitioner({ email, name, password });
    verifyPetitionerAccount({ email });

    cy.get('[data-testid="forgot-password-button"]').click();

    cy.get('[data-testid="send-password-reset-button"]').should('be.disabled');
    cy.get('[data-testid="email-input"]').clear();
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="send-password-reset-button"]').click();

    cy.get('[data-testid="success-alert"]').should(
      'contain',
      'Password reset code sent',
    );

    cy.get('[data-testid="change-password-button"]').should('be.disabled');

    verifyPasswordRequirements('[data-testid="new-password-input"]');

    cy.get('[data-testid="forgot-password-code"]').type(
      DEFAULT_FORGOT_PASSWORD_CODE,
    );
    const brandNewPassword = 'brandNewPassword1204$^';
    cy.get('[data-testid="new-password-input"]').clear();
    cy.get('[data-testid="new-password-input"]').type(brandNewPassword);
    cy.get('[data-testid="confirm-new-password-input"]').clear();
    cy.get('[data-testid="confirm-new-password-input"]').type(brandNewPassword);
    cy.get('[data-testid="change-password-button"]').click();
    cy.get('[data-testid="header-text"]').should('contain', `Welcome, ${name}`);

    logout();

    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(brandNewPassword);
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="header-text"]').should('contain', `Welcome, ${name}`);
  });

  it('should notify the user that their forgot password link has expired or is wrong when the user types in the wrong confirmation code and they should be able to request a new code', () => {
    const username = `cypress_test_account+${v4()}`;
    const email = `${username}@example.com`;
    const name = faker.person.fullName();
    createAPetitioner({ email, name, password });
    verifyPetitionerAccount({ email });

    cy.get('[data-testid="forgot-password-button"]').click();
    cy.get('[data-testid="email-input"]').clear();
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="send-password-reset-button"]').click();

    cy.get('[data-testid="success-alert"]').should(
      'contain',
      'Password reset code sent',
    );

    cy.get('[data-testid="forgot-password-code"]').type(
      'totally incorrect code',
    );
    cy.get('[data-testid="new-password-input"]').clear();
    cy.get('[data-testid="new-password-input"]').type(password);
    cy.get('[data-testid="confirm-new-password-input"]').clear();
    cy.get('[data-testid="confirm-new-password-input"]').type(password);
    cy.get('[data-testid="change-password-button"]').click();

    cy.get('[data-testid="error-alert"]').should(
      'contain',
      'Invalid verification code',
    );
    cy.get('[data-testid="request-new-forgot-password-code-button"]').click();
    cy.get('[data-testid="email-input"]').clear();
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="send-password-reset-button"]').click();

    cy.get('[data-testid="success-alert"]').should(
      'contain',
      'Password reset code sent',
    );
  });

  it('should alert a user that that they have been sent an email to assist them with the confirmation of their account when they enter an email address that has been granted e-access but has not set a password', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      const practitionerUserName = `cypress_test_account+${v4()}`;
      const practitionerEmail = `${practitionerUserName}@example.com`;
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

      cy.visit('/login');
      cy.get('[data-testid="forgot-password-button"]').click();
      cy.get('[data-testid="email-input"]').clear();
      cy.get('[data-testid="email-input"]').type(practitionerEmail);
      cy.get('[data-testid="send-password-reset-button"]').click();
      cy.get('[data-testid="warning-alert"]').should(
        'contain',
        'We’ve sent you an email',
      );
    });
  });
});
