import { createAPetitioner } from '../../helpers/create-a-petitioner';
import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { faker } from '@faker-js/faker';
import { logout } from '../../helpers/auth/logout';
import { v4 } from 'uuid';
import { verifyPasswordRequirements } from '../../helpers/auth/verify-password-requirements';
import { verifyPetitionerAccount } from '../../helpers/verify-petitioner-account';
import qs from 'qs';

describe('Forgot Password', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  /*
      Given a petitioner with a DAWSON account
      When they indicate that they Forgot Password
      And they type in an email address that is not associated with a DAWSON account
      Then they should be alerted in the same way as if the email is associated with a DAWSON account (security concern)
       */
  it('should alert a user exactly the same way as an associated DAWSON email when they enter an unassociated DAWSON email into forgot password(security concern)', () => {
    cy.visit('/login');
    cy.get('[data-testid="forgot-password-button"]').click();
    cy.get('[data-testid="email-input"]').clear();
    const emailWithoutAccount = `doesNotExist${v4()}@email.com`;
    cy.get('[data-testid="email-input"]').type(emailWithoutAccount);
    cy.get('[data-testid="send-password-reset-button"]').click();
    cy.get('[data-testid="success-alert"]').should(
      'contain',
      'Password reset email sent',
    );
  });

  /*
      Given a petitioner with a DAWSON account
      When they indicate that they Forgot Password
      And they type in an email address that is unconfirmed in DAWSON
      Then they should be alerted that they have been sent an email to assist them with confirmation of their account
       */
  it('should alert a user that that they have been sent an email to assist them with the confirmation of their account when they enter an email address that is an unconfirmed account', () => {
    const username = `cypress_test_account+${v4()}`;
    const email = `${username}@example.com`;
    const password = 'Testing1234$';
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

  /*
      Given a petitioner with a DAWSON account
      When they indicate that they Forgot Password
      And they do not click the password reset link that was emailed to them
      Then they should be able to log into their account with their existing password
       */
  it('should allow a user to login with their existing password if they have indicated they forgot their password and have not clicked the verification email', () => {
    const username = `cypress_test_account+${v4()}`;
    const email = `${username}@example.com`;
    const password = 'Testing1234$';
    const name = faker.person.fullName();
    createAPetitioner({ email, name, password });
    verifyPetitionerAccount({ email });

    cy.get('[data-testid="forgot-password-button"]').click();
    cy.get('[data-testid="email-input"]').clear();
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="send-password-reset-button"]').click();

    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password, {
      log: false,
    });
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="my-cases-link"]');
  });

  /*
      Given a petitioner with a DAWSON account
      When they indicate that they Forgot Password
      And they click the password reset link that was emailed to them
      Then they should be routed to the change password screen and after successful reset, be logged into their account
       */
  it('should reset a users password and log them in when they indicate they have forgotten their password and click on the email verfication link', () => {
    const username = `cypress_test_account+${v4()}`;
    const email = `${username}@example.com`;
    const password = 'Testing1234$';
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
      'Password reset email sent',
    );

    cy.task('getForgotPasswordCode', {
      email,
    }).then(forgotPasswordCode => {
      const queryString = qs.stringify(
        { code: forgotPasswordCode, email },
        { encode: true },
      );
      cy.visit(`/reset-password?${queryString}`);
    });

    cy.get('[data-testid="change-password-button"]').should('be.disabled');

    verifyPasswordRequirements('[data-testid="new-password-input"]');

    const brandNewPassword = 'brandNewPassword1204$^';
    cy.get('[data-testid="new-password-input"]').clear();
    cy.get('[data-testid="new-password-input"]').type(brandNewPassword);
    cy.get('[data-testid="confirm-new-password-input"]').clear();
    cy.get('[data-testid="confirm-new-password-input"]').type(brandNewPassword);
    cy.get('[data-testid="change-password-button"]').click();
    cy.get('[data-testid="header-text"]').should('contain', `Welcome, ${name}`);

    logout();

    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(brandNewPassword, {
      log: false,
    });
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="header-text"]').should('contain', `Welcome, ${name}`);
  });

  /*
      Given a petitioner with a DAWSON account
      When they indicate that they Forgot Password
      And it has been longer than 24 hours since they indicated they Forgot Password
      Then they should be alerted that their forgot password link has expired
       */
  it('should notify the user that their forgot password link has expired when the user clicks on the password verification link after 24 hours', () => {
    const username = `cypress_test_account+${v4()}`;
    const email = `${username}@example.com`;
    const password = 'Testing1234$';
    const name = faker.person.fullName();
    createAPetitioner({ email, name, password });
    verifyPetitionerAccount({ email });

    cy.get('[data-testid="forgot-password-button"]').click();
    cy.get('[data-testid="email-input"]').clear();
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="send-password-reset-button"]').click();

    cy.get('[data-testid="success-alert"]').should(
      'contain',
      'Password reset email sent',
    );

    cy.task('getForgotPasswordCode', {
      email,
    }).then(forgotPasswordCode => {
      cy.task('expireForgotPasswordCode', {
        email,
      });

      const queryString = qs.stringify(
        { code: forgotPasswordCode, email },
        { encode: true },
      );
      cy.visit(`/reset-password?${queryString}`);
    });

    cy.get('[data-testid="new-password-input"]').clear();
    cy.get('[data-testid="new-password-input"]').type('Testing1234$');
    cy.get('[data-testid="confirm-new-password-input"]').clear();
    cy.get('[data-testid="confirm-new-password-input"]').type('Testing1234$');
    cy.get('[data-testid="change-password-button"]').click();

    cy.get('[data-testid="error-alert"]').should('contain', 'Request expired');
  });

  /*
      Given an external user who has been granted e-access to DAWSON
      When they indicate that they Forgot Password
      And their account is unconfirmed
      Then they should be alerted that they have been sent an email to assist them with confirmation of their account
      */
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
