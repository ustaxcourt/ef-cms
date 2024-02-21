import { createAPetitioner } from '../../helpers/create-a-petitioner';
import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { createAndServePaperPetitionMultipleParties } from '../../helpers/create-and-serve-paper-petition-petitioner-and-spouse';
import { cypressEnv } from '../../helpers/env/cypressEnvironment';
import { logout } from '../../helpers/auth/logout';
import { v4 } from 'uuid';

describe('Admissions Clerk Grants E-Access', () => {
  const password = cypressEnv.defaultAccountPass;
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  /*
  Given an admissions clerk is working with a served paper case that has two petitioners
  When they grant the first petitioner electronic access to the case
  And the petitioner verifies their account
  Then a Notice Of Change of Email (NOCE) should be generated and served on the case, a work item added for the NOCE to the docket section work queue, and the petitioner`s service preference should change to Electronic
  */
  it('should generate a Notice Of Change of Email (NOCE) on the case, a work item added for the NOCE to the docket section work queue, and the petitioner`s service preference should change to Electronic when an admissions clerk grants e-access to a petitioner', () => {
    createAndServePaperPetition().then(({ docketNumber, name }) => {
      const petitionerUsername = `cypress_test_account+${v4()}`;
      const petitionerEmail = `${petitionerUsername}@example.com`;
      cy.login('admissionsclerk1');
      cy.get('[data-testid="messages-banner"]');
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get(
        `[data-testid="petitioner-card-${name}"] [data-testid="edit-petitioner-button"]`,
      ).click();
      cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
        petitionerEmail,
      );
      cy.get('[data-testid="internal-confirm-petitioner-email-input"]').type(
        petitionerEmail,
      );
      cy.get(
        '[data-testid="submit-edit-petitioner-information-button"]',
      ).click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="success-alert"]').contains('Changes saved');
      cy.get('[data-testid="petitioner-service-indicator"]').contains('Paper');
      logout();

      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(petitionerEmail);
      cy.get('[data-testid="password-input"]').type(password);
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="new-password-input"]').type(password);
      cy.get('[data-testid="confirm-new-password-input"]').type(password);
      cy.get('[data-testid="change-password-button"]').click();
      cy.get('[data-testid="my-cases-link"]');
      cy.task('waitForNoce', { docketNumber }).then(isNOCECreated => {
        expect(isNOCECreated).to.equal(
          true,
          'NOCE was not generated on a case that a petitioner was granted e-access for.',
        );
      });
      cy.get(`[data-testid="${docketNumber}"]`).contains(docketNumber).click();
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
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid="work-item-${docketNumber}"]`).contains(
        `Notice of Change of Email Address for ${name}`,
      );
    });
  });

  /*
  Given an admissions clerk is working with a served paper case that has two petitioners
  When they grant the second petitioner electronic access to the case
  And the petitioner verifies their account
  Then a Notice Of Change of Email (NOCE) should be generated and served on the case
  And a work item is added for the NOCE to the docket section work queue
  And the petitioner`s service preference should change to Electronic
  */
  it('should generate a Notice Of Change of Email (NOCE) on the case, a work item added for the NOCE to the docket section work queue, and the petitioner`s service preference should change to Electronic when an admissions clerk grants e-access to the second petitioner', () => {
    createAndServePaperPetitionMultipleParties().then(
      ({ docketNumber, spouseName }) => {
        const petitionerUsername = `cypress_test_account+${v4()}`;
        const petitionerEmail = `${petitionerUsername}@example.com`;
        cy.login('admissionsclerk1');
        cy.get('[data-testid="messages-banner"]');
        cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-parties"]').click();

        cy.get(
          `[data-testid="petitioner-card-${spouseName}"] [data-testid="edit-petitioner-button"]`,
        ).click();
        cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
          petitionerEmail,
        );
        cy.get('[data-testid="internal-confirm-petitioner-email-input"]').type(
          petitionerEmail,
        );
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
        cy.get('[data-testid="password-input"]').type(password);
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="new-password-input"]').type(password);
        cy.get('[data-testid="confirm-new-password-input"]').type(password);
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
        cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
        cy.get(`[data-testid="work-item-${docketNumber}"]`).contains(
          `Notice of Change of Email Address for ${spouseName}`,
        );
      },
    );
  });

  /*
  Given that a practitioner does not yet have a DAWSON account
  When an admissions clerk grants e-access to practitioner and adds them to a case
  Then they should be able to login
  And view their case
  */
  it('should allow a practitioner to login and view their case when an admissions clerk grants e-access to a practitioner', () => {
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
          cypressEnv.defaultAccountPass,
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
        });
      },
    );
  });

  /*
  Given a petitioner has created an account in DAWSON
  And they have not verified their account
  When an admissions clerk grants e-access to the petitioner by adding them to a case
  Then they should see a warning that the account is unverified
  And the email should not be updated
  */
  it('should display a modal and do nothing when an admissions clerk attempts to grant e-access to an email that is associated with an unverified account', () => {
    createAndServePaperPetition().then(({ docketNumber, name }) => {
      const petitionerUsername = `cypress_test_account+${v4()}`;
      const petitionerEmail = `${petitionerUsername}@example.com`;

      createAPetitioner({
        email: petitionerEmail,
        name,
        password: cypressEnv.defaultAccountPass,
      });

      cy.login('admissionsclerk1');
      cy.get('[data-testid="messages-banner"]');
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get(
        `[data-testid="petitioner-card-${name}"] [data-testid="edit-petitioner-button"]`,
      ).click();
      cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
        petitionerEmail,
      );
      cy.get('[data-testid="internal-confirm-petitioner-email-input"]').type(
        petitionerEmail,
      );
      cy.get(
        '[data-testid="submit-edit-petitioner-information-button"]',
      ).click();
      cy.get('[data-testid="modal-header"]').contains('Account is Unverified');
    });
  });
});
