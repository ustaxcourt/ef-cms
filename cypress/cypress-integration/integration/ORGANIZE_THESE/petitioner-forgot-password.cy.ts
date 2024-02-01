import { createAPetitioner } from '../../../helpers/create-a-petitioner';
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { verifyPetitionerAccount } from '../../../helpers/verify-petitioner-account';
import qs from 'qs';

describe('Given a petitioner with a DAWSON account', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  describe('When they indicate that they Forgot Password', () => {
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
        cy.get('[data-testid="forgot-password-button"]').click();

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
        const username = v4(); // todo: put back to v4, email is too long for validation
        const email = `${username}@example.com`;
        const password = 'Testing1234$';
        const name = faker.person.fullName();
        createAPetitioner({ email, name, password });
        verifyPetitionerAccount({ email });

        cy.get('[data-testid="forgot-password-button"]').click();
        cy.get('[data-testid="email-input"]').clear();
        cy.get('[data-testid="email-input"]').type(email);
        cy.get('[data-testid="forgot-password-button"]').click();

        cy.get('.usa-alert--success').should(
          'contain',
          'Password reset email sent',
        );

        cy.task('getForgotPasswordCode', {
          email,
        }).then(forgotPasswordCode => {
          const queryString = qs.stringify(
            { code: forgotPasswordCode, email },
            { encode: false },
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

        cy.visit('/login');
        cy.get('[data-testid="email-input"]').type(email);
        cy.get('[data-testid="password-input"]').type(password, {
          log: false,
        });
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="header-text"]');

        // Todo? Log out and log back in
      });

      describe('And it has been longer than 24 hours since they indicated they Forgot Password', () => {
        it('Then they should be alerted that their forgot password link has expired', () => {
          const username = v4(); // todo: put back to v4, email is too long for validation
          const email = `${username}@example.com`;
          const password = 'Testing1234$';
          const name = faker.person.fullName();
          createAPetitioner({ email, name, password });
          verifyPetitionerAccount({ email });

          cy.get('[data-testid="forgot-password-button"]').click();
          cy.get('[data-testid="email-input"]').clear();
          cy.get('[data-testid="email-input"]').type(email);
          cy.get('[data-testid="forgot-password-button"]').click();

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
              { encode: false },
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
