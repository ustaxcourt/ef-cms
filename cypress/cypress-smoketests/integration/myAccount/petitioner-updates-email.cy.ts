import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../../../cypress-integration/support/pages/my-account';
import { createAPetitioner } from '../../../helpers/accountCreation/create-a-petitioner';
import { faker } from '@faker-js/faker';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import { logout } from '../../../helpers/authentication/logout';
import { petitionerCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../helpers/documentQC/petitionsclerk-serves-petition';
import { v4 } from 'uuid';
import { verifyPetitionerAccount } from '../../../helpers/authentication/verify-petitioner-account';

describe('Petitioner Updates e-mail', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  /*
    Given a petitioner with a DAWSON account
    When they log in and change their email
    And they do not verify their new email
    And attempt to log in
    Then they should be alerted that they need to confirm their new email
  */
  it('should alert the petitioner that they need to verify their new email address when the user changes their email but does not verify their new email', () => {
    const username = `cypress_test_account+old${v4()}`;
    const email = `${username}@example.com`;
    const password = getCypressEnv().defaultAccountPass;
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

  /*
    Given a petitioner with a DAWSON account
    When they log in and change their email
    And they verify the new email
    Then they should be able to log in using the updated email and all of their associated cases should be updated with the new email
    And they should NOT be able to log in using their old email
  */
  it('should allow a petitioner to login with their updated email and have all associated cases updated with the new email when the user changes their email address and verifies it', () => {
    const username = `cypress_test_account+${v4()}`;
    const email = `${username}@example.com`;
    const password = getCypressEnv().defaultAccountPass;
    const name = faker.person.fullName();
    createAPetitioner({ email, name, password });
    verifyPetitionerAccount({ email });

    cy.login(username);

    petitionerCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      const updatedUsername = `cypress_test_account+${v4()}`;
      const updatedEmail = `${updatedUsername}@example.com`;
      cy.login(username);
      goToMyAccount();
      clickChangeEmail();
      changeEmailTo(updatedEmail);
      clickConfirmModal();
      confirmEmailPendingAlert();

      cy.task('getEmailVerificationToken', {
        email,
      }).then(verificationToken => {
        cy.visit(`/verify-email?token=${verificationToken}`);
      });

      cy.get('[data-testid="success-alert"]')
        .should('be.visible')
        .and(
          'contain.text',
          'Your email address is verified. You can now log in to DAWSON.',
        );
      cy.url().should('contain', '/login');
      cy.login(updatedUsername);

      cy.get('[data-testid="my-cases-link"]');
      cy.task('waitForNoce', { docketNumber }).then(isNOCECreated => {
        expect(isNOCECreated).to.equal(
          true,
          'NOCE was not generated on a case that a practitioner was granted e-access for.',
        );
      });
      cy.get(`[data-testid="${docketNumber}"]`).contains(docketNumber).click();
      cy.get('tbody:contains(NOCE)').should('exist');

      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="petitioner-email"]').should(
        'contain',
        updatedEmail,
      );
      cy.get('[data-testid="petitioner-pending-email"]').should(
        'not.contain.text',
      );
      cy.get('[data-testid="account-menu-button"]').click();
      cy.get('[data-testid="my-account-link"]').click();
      cy.get('[data-testid="user-service-email"]').should(
        'contain',
        updatedEmail,
      );
    });
    logout();

    // The code below will fail on cognito-local
    if (getCypressEnv().env !== 'local') {
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="password-input"]').type(password);
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="error-alert"]').contains(
        'The email address or password you entered is invalid.',
      );
    }
  });
});
