import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { faker } from '@faker-js/faker';
import { getCypressEnv } from '../../helpers/env/cypressEnvironment';
import { loginAsAdmissionsClerk } from '../../helpers/auth/login-as-helpers';
import { logout } from '../../helpers/auth/logout';
import { v4 } from 'uuid';

describe('Admissions Clerk Updates Practitioner Email', () => {
  /*
    Given that a practitioner has a DAWSON account
    When an admissions clerk updates the practitioner's email to one that already has an account in DAWSON
    Then they should be alerted an account already exists for the email entered
  */
  it('should not update the practitioner`s email address when the admissions clerk enters one that is already associated with a DAWSON account', () => {
    const practitionerUserName = `cypress_test_account+${v4()}`;
    const practitionerEmail = `${practitionerUserName}@example.com`;
    cy.login('admissionsclerk1');
    cy.get('[data-testid="messages-banner"]');
    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="tab-practitioner"]').click();
    cy.get('[data-testId="add-new-practitioner"]').click();
    cy.get('[data-testid="first-name-input"]').type(faker.person.firstName());
    cy.get('[data-testid="last-name-input"]').type(faker.person.lastName());
    cy.get('[data-testid="birth-year-input"]').type('1989');
    cy.get('[data-testid="practitioner-type-Attorney-radio"]').click();
    cy.get('[data-testid="employer-Private-radio"]').click();
    cy.get('[data-testid="contact.address1"]').type(
      faker.location.streetAddress(),
    );
    cy.get('[data-testid="contact.city"]').type(faker.location.city());
    cy.get('[data-testid="contact.state"]').select('OR');
    cy.get('[data-testid="contact.postalCode"]').type(faker.location.zipCode());
    cy.get('[data-testid="practitioner-phone-input"]').type(
      faker.phone.number(),
    );
    cy.get('[data-testid="practitioner-email-input"]').type(practitionerEmail);
    cy.get('[data-testid="practitioner-confirm-email-input"]').type(
      practitionerEmail,
    );
    cy.get('[data-testid="practitioner-bar-state-select"]').select('IL');
    cy.get(
      '.usa-date-picker__wrapper > [data-testid="admissions-date-picker"]',
    ).type('2/21/2008');
    cy.intercept('POST', '**/practitioners').as('postPractitioners');
    cy.get('[data-testid="create-practitioner-button"]').click();
    cy.wait('@postPractitioners').then(
      ({ response: practitionersResponse }) => {
        const practitionerBarNumber = practitionersResponse?.body.barNumber;
        cy.get('[data-testid="success-alert"]').contains('Practitioner added.');
        logout();
        cy.visit('/login');
        cy.get('[data-testid="email-input"]').type(practitionerEmail);
        cy.get('[data-testid="password-input"]').type(
          getCypressEnv().defaultAccountPass,
        );
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="new-password-input"]').type(
          getCypressEnv().defaultAccountPass,
        );
        cy.get('[data-testid="confirm-new-password-input"]').type(
          getCypressEnv().defaultAccountPass,
        );
        cy.get('[data-testid="change-password-button"]').click();
        cy.get('[data-testid="open-cases-count"]');
        logout();

        loginAsAdmissionsClerk();
        cy.get('[data-testid="search-link"]').click();
        cy.get('[data-testid="tab-practitioner"]').click();
        cy.get('[data-testid="bar-number-search-input"]').type(
          practitionerBarNumber,
        );
        cy.get(
          '[data-testid="practitioner-search-by-bar-number-button"]',
        ).click();
        cy.get('[data-testid="edit-practitioner-button"]').click();
        cy.get('[data-testid="practitioner-email-input"]').type(
          practitionerEmail,
        );
        cy.get('[data-testid="practitioner-confirm-email-input"]').type(
          practitionerEmail,
        );
        cy.get('[data-testid="save-practitioner-updates-button"]').click();
        cy.get('[data-testid="error-alert"]').contains(
          'An account with this email already exists. Enter a new email address.',
        );
      },
    );
  });

  /*
    Given that a practitioner has a DAWSON account
    And is associated a case
    When an admissions clerk updates the practitioner's email
    And the practitioner verifies the pending email
    Then their email should be updated on their associated cases
  */
  it('should update the practitioner`s email address when the admissions clerk enters one that is NOT already associated with a DAWSON account', () => {
    const practitionerUserName = `cypress_test_account+${v4()}`;
    const practitionerEmail = `${practitionerUserName}@example.com`;
    cy.login('admissionsclerk1');
    cy.get('[data-testid="messages-banner"]');
    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="tab-practitioner"]').click();
    cy.get('[data-testId="add-new-practitioner"]').click();
    cy.get('[data-testid="first-name-input"]').type(faker.person.firstName());
    cy.get('[data-testid="last-name-input"]').type(faker.person.lastName());
    cy.get('[data-testid="birth-year-input"]').type('1989');
    cy.get('[data-testid="practitioner-type-Attorney-radio"]').click();
    cy.get('[data-testid="employer-Private-radio"]').click();
    cy.get('[data-testid="contact.address1"]').type(
      faker.location.streetAddress(),
    );
    cy.get('[data-testid="contact.city"]').type(faker.location.city());
    cy.get('[data-testid="contact.state"]').select('OR');
    cy.get('[data-testid="contact.postalCode"]').type(faker.location.zipCode());
    cy.get('[data-testid="practitioner-phone-input"]').type(
      faker.phone.number(),
    );
    cy.get('[data-testid="practitioner-email-input"]').type(practitionerEmail);
    cy.get('[data-testid="practitioner-confirm-email-input"]').type(
      practitionerEmail,
    );
    cy.get('[data-testid="practitioner-bar-state-select"]').select('IL');
    cy.get(
      '.usa-date-picker__wrapper > [data-testid="admissions-date-picker"]',
    ).type('2/21/2008');
    cy.intercept('POST', '**/practitioners').as('postPractitioners');
    cy.get('[data-testid="create-practitioner-button"]').click();
    cy.wait('@postPractitioners').then(
      ({ response: practitionersResponse }) => {
        const practitionerBarNumber = practitionersResponse?.body.barNumber;
        cy.get('[data-testid="success-alert"]').contains('Practitioner added.');
        logout();

        cy.visit('/login');
        cy.get('[data-testid="email-input"]').type(practitionerEmail);
        cy.get('[data-testid="password-input"]').type(
          getCypressEnv().defaultAccountPass,
        );
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="new-password-input"]').type(
          getCypressEnv().defaultAccountPass,
        );
        cy.get('[data-testid="confirm-new-password-input"]').type(
          getCypressEnv().defaultAccountPass,
        );
        cy.get('[data-testid="change-password-button"]').click();
        cy.get('[data-testid="open-cases-count"]');

        createAndServePaperPetition().then(({ docketNumber }) => {
          cy.login('admissionsclerk1');
          cy.get('[data-testid="messages-banner"]');
          cy.get('[data-testid="docket-number-search-input"]').type(
            docketNumber,
          );
          cy.get('[data-testid="search-docket-number"]').click();
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="tab-parties"]').click();
          cy.get('[data-testid="practitioner-search-input"]').type(
            practitionerBarNumber,
          );
          cy.get('[data-testid="practitioner-search-submit-button"]').click();
          cy.get('[data-testid="practitioner-representing-0"]').click();
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('[data-testid="success-alert"]').should(
            'contain.text',
            'Petitioner counsel added to case.',
          );
          logout();

          cy.login(practitionerUserName);
          cy.get('[data-testid="my-cases-link"]');
          cy.get(`[data-testid="${docketNumber}"]`)
            .contains(docketNumber)
            .click();
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="tab-parties"]').click();
          cy.get('[data-testid="practitioner-contact-info"]').should(
            'contain',
            practitionerEmail,
          );
          logout();

          const updatedPractitionerUserName = `cypress_test_account+${v4()}`;
          const updatedPractitionerEmail = `${updatedPractitionerUserName}@example.com`;
          loginAsAdmissionsClerk();
          cy.get('[data-testid="search-link"]').click();
          cy.get('[data-testid="tab-practitioner"]').click();
          cy.get('[data-testid="bar-number-search-input"]').type(
            practitionerBarNumber,
          );
          cy.get(
            '[data-testid="practitioner-search-by-bar-number-button"]',
          ).click();
          cy.get('[data-testid="edit-practitioner-button"]').click();
          cy.get('[data-testid="practitioner-email-input"]').type(
            updatedPractitionerEmail,
          );
          cy.get('[data-testid="practitioner-confirm-email-input"]').type(
            updatedPractitionerEmail,
          );
          cy.get('[data-testid="save-practitioner-updates-button"]').click();
          cy.get('[data-testid="modal-header"]').contains(
            'Verification Email Sent',
          );
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('[data-testid="pending-practitioner-email"]').contains(
            `${updatedPractitionerEmail} (Pending)`,
          );
          logout();

          cy.login(practitionerUserName);
          cy.task('getEmailVerificationToken', {
            email: practitionerEmail,
          }).then(verificationToken => {
            cy.visit(`/verify-email?token=${verificationToken}`);
          });
          cy.get('[data-testid="success-alert"]')
            .should('be.visible')
            .and(
              'contain.text',
              'Your email address is verified. You can now log in to DAWSON.',
            );
          cy.login(updatedPractitionerUserName);
          cy.get('[data-testid="my-cases-link"]');
          cy.task('waitForPractitionerEmailUpdate', {
            docketNumber,
            practitionerEmail: updatedPractitionerEmail,
          }).then(emailIsUpdatedOnCase => {
            expect(emailIsUpdatedOnCase).to.equal(
              true,
              `The case ${docketNumber} does not reflect that the practitioner updated their email address.`,
            );
          });
          cy.get(`[data-testid="${docketNumber}"]`)
            .contains(docketNumber)
            .click();
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="tab-parties"]').click();
          cy.get('[data-testid="practitioner-contact-info"]').should(
            'contain',
            updatedPractitionerEmail,
          );
        });
      },
    );
  });
});
