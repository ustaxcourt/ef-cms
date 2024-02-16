import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../../cypress-integration/support/pages/my-account';
import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { createAndServePaperPetitionMultipleParties } from '../../helpers/create-and-serve-paper-petition-petitioner-and-spouse';
import { cypressEnv } from '../../helpers/env/cypressEnvironment';
import { logout } from '../../helpers/auth/logout';
import { v4 } from 'uuid';

// TODO 10007
// Old Test Files
// web-client/integration-tests/admissionsClerkAddsPetitionerWithNoAccountToCase.test.ts
// web-client/integration-tests/admissionsClerkAddsSecondaryPetitionerWithNoAccountToCase.test.ts
// web-client/integration-tests/petitionsClerkCounselAssociationElectronicServiceJourney.test.ts
describe('Given an admissions clerk is working with a served paper case that has two petitioners', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });
  describe('When they grant the first petitioner electronic access to the case', () => {
    describe('And the petitioner verifies their account', () => {
      it('Then a Notice Of Change of Email (NOCE) should be generated and served on the case, a work item added for the NOCE to the docket section work queue, and the petitioner`s service preference should change to Electronic', () => {
        createAndServePaperPetition().then(({ docketNumber, name }) => {
          // petitioner?
          const petitionerUsername = `cypress_test_account+${v4()}`;
          const petitionerEmail = `${petitionerUsername}@example.com`;
          cy.login('admissionsclerk1');
          cy.get('[data-testid="messages-banner"]');
          cy.get('[data-testid="docket-number-search-input"]').type(
            docketNumber,
          );
          cy.get('[data-testid="search-docket-number"]').click();
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="tab-parties"]').click();
          cy.get(
            `[data-testid="petitioner-card-${name}"] [data-testid="edit-petitioner-button"]`,
          ).click();
          cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
            petitionerEmail,
          );
          cy.get(
            '[data-testid="internal-confirm-petitioner-email-input"]',
          ).type(petitionerEmail);
          cy.get(
            '[data-testid="submit-edit-petitioner-information-button"]',
          ).click();
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('[data-testid="success-alert"]').contains('Changes saved');
          cy.get('[data-testid="petitioner-service-indicator"]').contains(
            'Paper',
          );
          logout();

          cy.visit('/login');
          cy.get('[data-testid="email-input"]').type(petitionerEmail);
          cy.get('[data-testid="password-input"]').type('Testing1234$', {
            log: false,
          });
          cy.get('[data-testid="login-button"]').click();
          cy.get('[data-testid="new-password-input"]').type('Testing1234$');
          cy.get('[data-testid="confirm-new-password-input"]').type(
            'Testing1234$',
          );
          cy.get('[data-testid="change-password-button"]').click();
          cy.get('[data-testid="my-cases-link"]');
          cy.task('waitForNoce', { docketNumber }).then(isNOCECreated => {
            expect(isNOCECreated).to.equal(
              true,
              'NOCE was not generated on a case that a petitioner was granted e-access for.',
            );
          });
          cy.get(`[data-testid="${docketNumber}"]`)
            .contains(docketNumber)
            .click();
          cy.get('tbody:contains(NOCE)').should('exist');
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="tab-parties"]').click();
          cy.get(
            `[data-testid="petitioner-card-${name}"] [data-testid="petitioner-service-indicator"]`,
          ).contains('Electronic');
          cy.get(
            `[data-testid="petitioner-card-${name}"] [data-testid="petitioner-pending-email"]`,
          ).should('not.contain.text');
          logout();

          cy.login('docketclerk1');
          cy.get('[data-testid="messages-banner"]');
          cy.get('[data-testid="document-qc-nav-item"]').click();
          cy.get(
            '[data-testid="switch-to-section-document-qc-button"]',
          ).click();
          cy.get(`[data-testid="work-item-${docketNumber}"]`).contains(
            `Notice of Change of Email Address for ${name}`,
          );
        });
      });
    });
  });

  describe('When they grant the second petitioner electronic access to the case', () => {
    describe('And the petitioner verifies their account', () => {
      it('Then a Notice Of Change of Email (NOCE) should be generated and served on the case, a work item added for the NOCE to the docket section work queue, and the petitioner`s service preference should change to Electronic', () => {
        createAndServePaperPetitionMultipleParties().then(
          ({ docketNumber, spouseName }) => {
            const petitionerUsername = `cypress_test_account+${v4()}`;
            const petitionerEmail = `${petitionerUsername}@example.com`;
            cy.login('admissionsclerk1');
            cy.get('[data-testid="messages-banner"]');
            cy.get('[data-testid="docket-number-search-input"]').type(
              docketNumber,
            );
            cy.get('[data-testid="search-docket-number"]').click();
            cy.get('[data-testid="tab-case-information"]').click();
            cy.get('[data-testid="tab-parties"]').click();

            cy.get(
              `[data-testid="petitioner-card-${spouseName}"] [data-testid="edit-petitioner-button"]`,
            ).click();
            cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
              petitionerEmail,
            );
            cy.get(
              '[data-testid="internal-confirm-petitioner-email-input"]',
            ).type(petitionerEmail);
            cy.get(
              '[data-testid="submit-edit-petitioner-information-button"]',
            ).click();
            cy.get('[data-testid="modal-button-confirm"]').click();
            cy.get('[data-testid="success-alert"]').contains('Changes saved');
            cy.get('[data-testid="petitioner-service-indicator"]').contains(
              'Paper',
            );
            logout();

            cy.visit('/login');
            cy.get('[data-testid="email-input"]').type(petitionerEmail);
            cy.get('[data-testid="password-input"]').type('Testing1234$', {
              log: false,
            });
            cy.get('[data-testid="login-button"]').click();
            cy.get('[data-testid="new-password-input"]').type('Testing1234$');
            cy.get('[data-testid="confirm-new-password-input"]').type(
              'Testing1234$',
            );
            cy.get('[data-testid="change-password-button"]').click();
            cy.get('[data-testid="my-cases-link"]');
            cy.task('waitForNoce', { docketNumber }).then(isNOCECreated => {
              expect(isNOCECreated).to.equal(
                true,
                'NOCE was not generated on a case that a petitioner was granted e-access for.',
              );
            });
            cy.get(`[data-testid="${docketNumber}"]`)
              .contains(docketNumber)
              .click();
            cy.get('tbody:contains(NOCE)').should('exist');
            cy.get('[data-testid="tab-case-information"]').click();
            cy.get('[data-testid="tab-parties"]').click();

            cy.get(
              `[data-testid="petitioner-card-${spouseName}"] [data-testid="petitioner-service-indicator"]`,
            ).contains('Electronic');
            cy.get(
              `[data-testid="petitioner-card-${spouseName}"] [data-testid="petitioner-pending-email"]`,
            ).should('not.contain.text');
            logout();

            cy.login('docketclerk1');
            cy.get('[data-testid="messages-banner"]');
            cy.get('[data-testid="document-qc-nav-item"]').click();
            cy.get(
              '[data-testid="switch-to-section-document-qc-button"]',
            ).click();
            cy.get(`[data-testid="work-item-${docketNumber}"]`).contains(
              `Notice of Change of Email Address for ${spouseName}`,
            );
          },
        );
      });
    });
  });
});

describe('Given that a practitioner does not yet have a DAWSON account', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });
  /*
  Given that a practitioner does not yet have a DAWSON account
  But their bar number is associated with a case in DAWSON
  When an admissions clerks creates an account for them
  Then they should be able to gain e-access by confirming their email address, and an NOCE should be generated and served on their associated case(s)
  */
  it('admissions clerk grants e-access to practitioner', () => {
    const practitionerUserName = `cypress_test_account+${v4()}`;
    const practitionerEmail = `${practitionerUserName}@example.com`;
    cy.login('admissionsclerk1');
    cy.get('[data-testid="messages-banner"]');
    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="tab-practitioner"]').click();
    cy.get('[data-testId="add-new-practitioner"]').click();
    cy.get('[data-testid="first-name-input"]').type('Hyper');
    cy.get('[data-testid="middle-name-input"]').type('Specific');
    cy.get('[data-testid="last-name-input"]').type('Name');
    cy.get('[data-testid="birth-year-input"]').type('1900');
    cy.get('[data-testid="practitioner-type-Attorney-radio"]').click();
    cy.get('[data-testid="employer-Private-radio"]').click();
    cy.get('[data-testid="contact.address1"]').type('3829 Barington St');
    cy.get('[data-testid="contact.city"]').type('Chicago');
    cy.get('[data-testid="contact.state"]').select('IL');
    cy.get('[data-testid="contact.postalCode"]').type('98456');
    cy.get('[data-testid="practitioner-phone-input"]').type('5555555555');
    cy.get('[data-testid="practitioner-email-input"]').type(practitionerEmail);
    cy.get('[data-testid="practitioner-confirm-email-input"]').type(
      practitionerEmail,
    );
    cy.get('[data-testid="practitioner-bar-state-select"]').select('AZ');
    cy.get(
      '.usa-date-picker__wrapper > [data-testid="admissions-date-picker"]',
    ).type('12/27/1988');
    cy.get('[data-testid="create-practitioner-button"]').click();
    cy.get('[data-testid="success-alert"]').contains('Practitioner added.');
    logout();

    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(practitionerEmail);
    cy.get('[data-testid="password-input"]').type(
      cypressEnv.defaultAccountPass,
      { log: false },
    );
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="new-password-input"]').type(
      cypressEnv.defaultAccountPass,
    );
    cy.get('[data-testid="confirm-new-password-input"]').type(
      cypressEnv.defaultAccountPass,
    );
    cy.get('[data-testid="change-password-button"]').click();
    cy.get('[data-testid="open-cases-count"]');
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.login('admissionsclerk1');
      cy.get('[data-testid="messages-banner"]');
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="practitioner-search-input"]').type(
        'Hyper Specific Name',
      );
      cy.get('[data-testid="practitioner-search-submit-button"]').click();
      cy.get('[data-testid="counsel-0-radio"]').click();
      cy.get('[data-testid="practitioner-representing-0"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      logout();

      cy.login(practitionerUserName);
      goToMyAccount();
      clickChangeEmail();
      const updatedUsername = `cypress_test_account+${v4()}`;
      const updatedEmail = `${updatedUsername}@example.com`;
      changeEmailTo(updatedEmail);
      clickConfirmModal();
      confirmEmailPendingAlert();

      cy.task('getEmailVerificationToken', {
        email: practitionerEmail,
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
      // cy.get('[data-testid="petitioner-email"]').should(
      //   'contain',
      //   updatedEmail,
      // );
      // cy.get('[data-testid="petitioner-pending-email"]').should(
      //   'not.contain.text',
      // );
      cy.get('[data-testid="account-menu-button"]').click();
      cy.get('[data-testid="my-account-link"]').click();
      cy.get('[data-testid="user-service-email"]').should(
        'contain',
        updatedEmail,
      );
    });
  });
});

// describe('But their bar number is associated with a case in DAWSON', () => {
//   describe('When an admissions clerks creates an account for them', () => {
//     describe('And the admissions clerk associates the practitioner with a case', () => {
//       describe('And');
//     });
//   });
// });
