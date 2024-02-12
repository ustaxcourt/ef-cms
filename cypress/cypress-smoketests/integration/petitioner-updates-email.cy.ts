import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../../cypress-integration/support/pages/my-account';
import { createAPetitioner } from '../../helpers/create-a-petitioner';
import { faker } from '@faker-js/faker';
import { navigateTo as loginAs } from '../../cypress-integration/support/pages/maintenance';
import { petitionerCreatesElectronicCase } from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../cypress-integration/support/setup/petitionsclerk-serves-petition';
import { v4 } from 'uuid';
import { verifyPetitionerAccount } from '../../helpers/verify-petitioner-account';

describe('Given a petitioner with a DAWSON account', () => {
  describe('When they log in and change their email', () => {
    describe('And they do not verify their new email', () => {
      describe('And attempt to log in', () => {
        it('Then they should be alerted that they need to confirm their new email', () => {
          const username = `cypress_test_account+old${v4()}`;
          const email = `${username}@example.com`;
          const password = 'Testing1234$';
          const name = faker.person.fullName();
          createAPetitioner({ email, name, password });
          verifyPetitionerAccount({ email });
          cy.login(username);
          cy.get('[data-testid="account-menu-button"]').click();
          cy.get('[data-testid="my-account-link"]').click();
          const newUsername = `cypress_test_account+new${v4()}`;
          cy.get('[data-testid="change-email-button"]').click();
          cy.get('[data-testid="change-login-email-input"]').type(
            `${newUsername}@example.com`,
          );
          cy.get('[data-testid="confirm-change-login-email-input"]').type(
            `${newUsername}@example.com`,
          );
          cy.get('[data-testid="save-change-login-email-button"]').click();
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.reload();

          cy.get('[data-testid="verify-email-warning"]').contains(
            `A verification email has been sent to ${newUsername}@example.com. Verify your email to log in and receive service at the new email address.`,
          );
        });
      });

      describe('And they verify the new email', () => {
        it('Then they should be able to log in using the updated email and all of their associated cases should be updated with the new email', () => {
          loginAs('petitioner9');

          petitionerCreatesElectronicCase().then(docketNumber => {
            // TODO: standardize who is responsible for logging in, is it the test or the test helper function
            petitionsClerkServesPetition(docketNumber);

            loginAs('petitioner9');
            const randomSuffix = parseInt(`${Math.random() * 100}`);
            goToMyAccount();
            clickChangeEmail();
            changeEmailTo(`petitioner9+test${randomSuffix}@example.com`);
            clickConfirmModal();
            confirmEmailPendingAlert();

            const petitioner9Id = 'b2d1941f-230a-47bb-80ec-6b561c1765cd';
            cy.task('getEmailVerificationToken', {
              userId: petitioner9Id,
            }).then(verificationToken => {
              cy.visit(`/verify-email?token=${verificationToken}`);
            });
            cy.get('[data-testid="success-alert"]')
              .should('be.visible')
              .and(
                'contain.text',
                'Your email address is verified. You can now sign in to DAWSON.',
              );
            cy.url().should('contain', '/login');
            cy.login(`petitioner9+test${randomSuffix}`);

            cy.get('[data-testid="my-cases-link"]');
            cy.task('waitForNoce', { docketNumber }).then(isNOCECreated => {
              expect(isNOCECreated).to.equal(
                true,
                'NOCE was not generated on a case that a practitioner was granted e-access for.',
              );
            });
            cy.get(`[data-testid="${docketNumber}"]`)
              .contains(docketNumber)
              .click();
            cy.get('tbody:contains(NOCE)').should('exist');

            cy.get('[data-testid="tab-case-information"]').click();
            cy.get('[data-testid="tab-parties"]').click();
            cy.get('[data-testid="petitioner-email"]').should(
              'contain',
              `petitioner9+test${randomSuffix}@example.com`,
            );
            cy.get('[data-testid="petitioner-pending-email"]').should(
              'not.contain.text',
            );
            cy.get('[data-testid="account-menu-button"]').click();
            cy.get('[data-testid="my-account-link"]').click();
            cy.get('[data-testid="user-service-email"]').should(
              'contain',
              `petitioner9+test${randomSuffix}@example.com`,
            );
          });
        });
      });
    });
  });
});
