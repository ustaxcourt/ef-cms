import { createAPetitioner } from '../../helpers/create-a-petitioner';
import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { faker } from '@faker-js/faker';
import { logout } from '../../helpers/auth/logout';
import { v4 } from 'uuid';
import { verifyPasswordRequirements } from '../../helpers/auth/verify-password-requirements';
import { verifyPetitionerAccount } from '../../helpers/verify-petitioner-account';
import qs from 'qs';

describe('Given a petitioner with a DAWSON account', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('When they indicate that they Forgot Password', () => {
    describe('And they type in an email address that is not associated with a DAWSON account', () => {
      it('Then they should be alerted in the same way as if the email is associated with a DAWSON account (security concern)', () => {
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
    });

    describe('And they type in an email address that is unconfirmed in DAWSON', () => {
      it('Then they should be alerted that they have been sent an email to assist them with confirmation of their account', () => {
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
    });

    describe('And they do not click the password reset link that was emailed to them', () => {
      it('Then they should be able to log into their account with their existing password', () => {
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
    });

    describe('And they click the password reset link that was emailed to them', () => {
      it('Then they should be routed to the change password screen and after successful reset, be logged into their account', () => {
        const username = `cypress_test_account+${v4()}`;
        const email = `${username}@example.com`;
        const password = 'Testing1234$';
        const name = faker.person.fullName();
        createAPetitioner({ email, name, password });
        verifyPetitionerAccount({ email });

        cy.get('[data-testid="forgot-password-button"]').click();

        cy.get('[data-testid="send-password-reset-button"]').should(
          'be.disabled',
        );
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
        cy.get('[data-testid="confirm-new-password-input"]').type(
          brandNewPassword,
        );
        cy.get('[data-testid="change-password-button"]').click();
        cy.get('[data-testid="header-text"]').should(
          'contain',
          `Welcome, ${name}`,
        );

        logout();

        cy.get('[data-testid="email-input"]').type(email);
        cy.get('[data-testid="password-input"]').type(brandNewPassword, {
          log: false,
        });
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="header-text"]').should(
          'contain',
          `Welcome, ${name}`,
        );
      });

      describe('And it has been longer than 24 hours since they indicated they Forgot Password', () => {
        it('Then they should be alerted that their forgot password link has expired', () => {
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
          cy.get('[data-testid="confirm-new-password-input"]').type(
            'Testing1234$',
          );
          cy.get('[data-testid="change-password-button"]').click();

          cy.get('[data-testid="error-alert"]').should(
            'contain',
            'Request expired',
          );
        });
      });
    });
  });
});

describe('Given an external user who has been granted e-access to DAWSON', () => {
  describe('When they indicate that they Forgot Password', () => {
    describe('And their account is unconfirmed', () => {
      it('Then they should be alerted that they have been sent an email to assist them with confirmation of their account', () => {
        createAndServePaperPetition().then(({ docketNumber }) => {
          const practitionerUserName = `cypress_test_account+${v4()}`;
          const practitionerEmail = `${practitionerUserName}@example.com`;
          cy.login('admissionsclerk1');
          cy.get('[data-testid="messages-banner"]');
          cy.get('[data-testid="docket-number-search-input"]').type(
            docketNumber,
          );
          cy.get('[data-testid="search-docket-number"]').click();
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="tab-parties"]').click();
          cy.get('[data-testid="edit-petitioner"]').click();
          cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
            practitionerEmail,
          );
          cy.get(
            '[data-testid="internal-confirm-petitioner-email-input"]',
          ).type(practitionerEmail);
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
  });
});
