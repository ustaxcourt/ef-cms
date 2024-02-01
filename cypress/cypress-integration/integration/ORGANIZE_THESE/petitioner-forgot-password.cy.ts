import { createAPetitioner } from '../../../helpers/create-a-petitioner';
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { verifyPetitionerAccount } from '../../../helpers/verify-petitioner-account';
import qs from 'qs';

describe('Given a petitioner with a DAWSON account', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  describe('When they indiate that they Forgot Password', () => {
    describe('And they do not verify their identity by clicking the link emailed to them', () => {
      describe('And they log in using their credentials', () => {
        it('Then they should be logged in to their account', () => {
          const username = `cypress_test_account+${v4()}`; // didn't we say that v4 uuid doesn't generate unique ids sometimes???
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
    });

    describe('And they verify their identity by clicking the link emailed to them', () => {
      it('Then they should be routed to the change password screen and after successful reset, be logged into their account', () => {
        const username = 'cypress+2'; // todo: put back to v4, email is too long for validation
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

        // cy.get('[data-testid="reset-password-link"]').click();
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
        cy.get('[data-testid="confirm-password-input"]').clear();
        cy.get('[data-testid="confirm-password-input"]').type('Testing1234$');
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
        it('Then they should be alerted that an email has been sent if they have an account with a new reset password link', () => {
          const username = 'cypress10'; // todo: put back to v4, email is too long for validation
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
            console.log(forgotPasswordCode, email, '*****');
            const queryString = qs.stringify(
              { code: forgotPasswordCode, email },
              { encode: false },
            );

            cy.task('expireForgotPasswordCode', {
              email,
            }).then(() => {
              cy.visit(`/reset-password?${queryString}`);
            });
          });

          cy.get('[data-testid="new-password-input"]');
          // cy.get('[data-testid="new-password-input"]').clear();
          // cy.get('[data-testid="new-password-input"]').type('Testing1234$');
          // cy.get('[data-testid="confirm-password-input"]').clear();
          // cy.get('[data-testid="confirm-password-input"]').type('Testing1234$');
          // cy.get('[data-testid="change-password-button"]').click();

          // cy.visit('/login');
          // cy.get('[data-testid="email-input"]').type(email);
          // cy.get('[data-testid="password-input"]').type(password, {
          //   log: false,
          // });
          // cy.get('[data-testid="login-button"]').click();
          // cy.get('[data-testid="header-text"]');
        });
      });
    });
  });
});
