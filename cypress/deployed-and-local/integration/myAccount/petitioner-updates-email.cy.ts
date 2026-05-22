import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../../../local-only/support/pages/my-account';
import { createAPetitioner } from '../../../helpers/accountCreation/create-a-petitioner';
import { externalUserCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { faker } from '@faker-js/faker';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import {
  loginAsPetitioner,
  loginAsPetitionsClerk1,
} from '../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../helpers/documentQC/petitionsclerk-serves-petition';
import { v4 } from 'uuid';
import { verifyPetitionerAccount } from '../../../helpers/authentication/verify-petitioner-account';
import { goToCase } from '../../../helpers/caseDetail/go-to-case';

describe('Petitioner Updates e-mail', () => {
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
    // const username = `cypress_test_account+old${v4()}`;
    const email = `cypress_test_account+old${v4()}@example.com`;
    const password = getCypressEnv().defaultAccountPass;
    const name = faker.person.fullName();
    createAPetitioner({ email, name, password });
    verifyPetitionerAccount({ email });
    loginAsPetitioner(email);
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
    const email = `cypress_test_account+${v4()}@example.com`;
    const password = getCypressEnv().defaultAccountPass;
    const name = faker.person.fullName();
    createAPetitioner({ email, name, password });
    verifyPetitionerAccount({ email });

    loginAsPetitioner(email);

    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      // As a Petitions Clerk, verify that after serving the petition,
      // the contact email address is set to the original service email address
      logout();
      loginAsPetitionsClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      // Verify that contact email address matches the original service email
      cy.get('[data-testid="petitioner-paper-petition-email"]').should(
        'contain',
        email,
      );
      // Verify that service email address also matches the original email
      cy.get('[data-testid="petitioner-email"]').should('contain', email);

      const updatedEmail = `cypress_test_account+${v4()}@example.com`;
      logout();
      loginAsPetitioner(email);
      goToMyAccount();
      clickChangeEmail();
      changeEmailTo(updatedEmail);
      clickConfirmModal();
      confirmEmailPendingAlert();
      logout();

      cy.task('getEmailVerificationToken', {
        email,
      }).then(verificationToken => {
        const publicSiteUrl = getCypressEnv().publicSiteUrl;
        cy.origin(
          publicSiteUrl,
          { args: { publicSiteUrl, verificationToken } },
          ({ publicSiteUrl: url, verificationToken: token }) => {
            cy.visit(`${url}/verify-email?token=${token}`);
            cy.get('[data-testid="success-alert"]')
              .should('be.visible')
              .and(
                'contain.text',
                'Your email address is verified. You can now log in to DAWSON.',
              );
          },
        );
      });
      loginAsPetitioner(updatedEmail);

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
      // Verify that service email address is updated to the new email
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

      // As a Petitions Clerk, verify that the contact email address remains as the original email
      // (Contact email address is only visible to internal users, not external users)
      logout();
      loginAsPetitionsClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      // Verify that service email address is updated to the new email
      cy.get('[data-testid="petitioner-email"]').should(
        'contain',
        updatedEmail,
      );
      // Verify that contact email address remains as the original email
      cy.get('[data-testid="petitioner-paper-petition-email"]').should(
        'contain',
        email,
      );
    });
    logout();

    // The code below will fail on cognito-local
    if (getCypressEnv().env !== 'local') {
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="password-input"]').type(password);
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid^="error-alert"]').should('exist');
    }
  });

  it('should show error alert and not update the petitioner email address when they enter the incorrect email confirmation code', () => {
    const email = `cypress_test_account+${v4()}@example.com`;
    const password = getCypressEnv().defaultAccountPass;
    const name = faker.person.fullName();
    createAPetitioner({ email, name, password });
    verifyPetitionerAccount({ email });

    const updatedEmail = `cypress_test_account+${v4()}@example.com`;
    loginAsPetitioner(email);
    goToMyAccount();
    clickChangeEmail();
    changeEmailTo(updatedEmail);
    clickConfirmModal();

    logout();
    const publicSiteUrl = getCypressEnv().publicSiteUrl;
    cy.origin(
      publicSiteUrl,
      { args: { publicSiteUrl } },
      ({ publicSiteUrl: url }) => {
        cy.visit(`${url}/verify-email?token=hello_world`);
        cy.get('[data-testid^="error-alert"]')
          .should('be.visible')
          .and(
            'contain.text',
            'Your request cannot be completed. Please try to log in. If you\u2019re still having trouble',
          );
      },
    );
    loginAsPetitioner(email);
  });
});
