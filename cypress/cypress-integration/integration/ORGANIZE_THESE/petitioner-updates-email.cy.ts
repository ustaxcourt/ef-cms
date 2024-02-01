import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../../support/pages/my-account';
import { createAPetitioner } from '../../../helpers/create-a-petitioner';
import { faker } from '@faker-js/faker';
import { navigateTo as loginAs } from '../../support/pages/maintenance';
import { petitionerCreatesElectronicCase } from '../../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../support/setup/petitionsclerk-serves-petition';
import { verifyPetitionerAccount } from '../../../helpers/verify-petitioner-account';

describe('Given a petitioner with a DAWSON account', () => {
  describe('When they log in and change their email', () => {
    describe('And they do not verify their new email', () => {
      describe('And attempt to log in', () => {
        it('Then they should be alerted that they need to confirm their new email', () => {
          const email = faker.internet.email();
          const password = 'Testing1234$';
          const name = faker.person.fullName();
          createAPetitioner({ email, name, password });
          verifyPetitionerAccount({ email });

          // Login
          // Change Account Email
          // Logout
          // Login with existing email
          // Expect to see yellow banner that indicates they have a pending email
        });
      });

      describe.skip('And they verify the new email', () => {
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
