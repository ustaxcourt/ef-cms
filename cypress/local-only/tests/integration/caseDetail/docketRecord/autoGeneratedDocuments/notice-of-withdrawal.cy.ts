import { RawPetitioner } from '@shared/business/entities/contacts/Petitioner';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  calculateISODate,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  loginAsDocketClerk1,
  loginAsIrsPractitioner1,
  loginAsPetitionsClerk,
  loginAsPetitionsClerk1,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { addPartyPetitionerToCase } from 'cypress/helpers/caseDetail/caseInformation/add-party-petitioner-to-case';
import { addPrivatePractitionerToCase } from 'cypress/helpers/caseDetail/caseInformation/add-private-practitioner-to-case';
import { petitionsClerkAddsRespondentToCase } from 'cypress/helpers/caseDetail/caseInformation/petitionsclerk-adds-respondent-to-case';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';
import { petitionsClerkServesPetition } from 'cypress/helpers/documentQC/petitionsclerk-serves-petition';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import { calendarTrialSession } from 'cypress/helpers/trialSession/calendar-trial-session';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { scheduleTrialSession } from 'cypress/helpers/trialSession/schedule-trial-session';
import { updateTrialSessionStartDate } from 'cypress/helpers/trialSession/update-trial-session-start-date';

describe('Notice of Withdrawal', () => {
  // const privatePractitionerBarNumber = 'PT5432';
  const privatePractitioner2BarNumber = 'PT9999';
  const irsPractitionerBarNumber = 'RT0987';
  const irsPractitioner2BarNumber = 'RT6789';

  const invalidFutureDate = formatDateString(
    calculateISODate({ howMuch: 1 }),
    FORMATS.MMDDYYYY,
  );
  const validFutureDate = formatDateString(
    calculateISODate({ howMuch: 31 }),
    FORMATS.MMDDYYYY,
  );

  beforeEach(() => {
    loginAsPetitionsClerk();

    createTrialSession({
      startDate: invalidFutureDate,
    }).then(({ trialSessionId }) => {
      cy.wrap(trialSessionId).as('trialSessionId');
      loginAsPrivatePractitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        cy.wrap(docketNumber).as('docketNumber');

        loginAsPetitionsClerk1();
        petitionsClerkServesPetition(docketNumber);

        loginAsDocketClerk1();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        calendarTrialSession(trialSessionId);
        scheduleTrialSession(docketNumber, trialSessionId);
      });
    });
  });
  it('should show validatition messages for private practitioner when selecting form type', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsPrivatePractitioner();
      cy.get(`[data-testid="${docketNumber}"] a`).click();
    });
    cy.get('[data-testid="button-file-document"]').click();
    cy.get('[data-testid="ready-to-file"]').click();
    selectTypeaheadInput(
      'complete-doc-document-type-search',
      'Notice of Withdrawal as Counsel',
    );
    cy.get('[data-testid="submit-document"]').click();
    cy.get('[data-testid="error-alert"]').should('be.visible');
    cy.get('[data-testid="error-alert"]').contains(
      'You are the only counsel representing a party on this case.',
    );
    cy.get('[data-testid="error-alert"]').contains(
      'The case is scheduled for trial in less than 30 days.',
    );
  });
  it('should show validation messages for irs practitioners when selecting form type', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      petitionsClerkAddsRespondentToCase(
        docketNumber,
        irsPractitionerBarNumber,
      );
      loginAsIrsPractitioner1();
      cy.get(`[data-testid="${docketNumber}"] a`).click();
    });
    cy.get('[data-testid="button-file-document"]').click();
    cy.get('[data-testid="ready-to-file"]').click();
    selectTypeaheadInput(
      'complete-doc-document-type-search',
      'Notice of Withdrawal as Counsel',
    );
    cy.get('[data-testid="submit-document"]').click();
    cy.get('[data-testid="error-alert"]').should('be.visible');
    cy.get('[data-testid="error-alert"]').contains(
      'You are the only counsel representing a party on this case.',
    );
    cy.get('[data-testid="error-alert"]').contains(
      'The case is scheduled for trial in less than 30 days.',
    );
  });
  it('should show validation messages for private practitioners when trying to review filing', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      addPrivatePractitionerToCase(docketNumber, privatePractitioner2BarNumber);

      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });

      loginAsPrivatePractitioner();
      cy.get(`[data-testid="${docketNumber}"] a`).click();
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Notice of Withdrawal as Counsel',
      );
      cy.get('[data-testid="submit-document"]').click();
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="error-alert"]').should('be.visible');
      cy.get('[data-testid="error-alert"]').contains('Select a filing party');
      cy.get('[data-testid="error-alert"]').contains(
        'All parties have not consented to your withdrawal as counsel.',
      );
    });
  });
  it('should show validatition messages for irs practitioner when trying to review filing', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      petitionsClerkAddsRespondentToCase(
        docketNumber,
        irsPractitionerBarNumber,
      );
      petitionsClerkAddsRespondentToCase(
        docketNumber,
        irsPractitioner2BarNumber,
      );

      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });

      loginAsIrsPractitioner1();
      cy.get(`[data-testid="${docketNumber}"] a`).click();
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Notice of Withdrawal as Counsel',
      );
      cy.get('[data-testid="submit-document"]').click();
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="error-alert"]').should('be.visible');
      cy.get('[data-testid="error-alert"]').contains('Select a filing party');
      cy.get('[data-testid="error-alert"]').contains(
        'All parties have not consented to your withdrawal as counsel.',
      );
    });
  });

  it('should edit the contact information for petitioner in the auto generated form', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      addPrivatePractitionerToCase(docketNumber, privatePractitioner2BarNumber);
      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });
      loginAsPrivatePractitioner();
      cy.get(`[data-testid="${docketNumber}"] a`).click();
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Notice of Withdrawal as Counsel',
      );
      cy.get('[data-testid="submit-document"]').click();

      cy.get('[data-testid^="party-label-"]').first().click();
      cy.get('[data-testid="allPartiesConsent-yes-label"]').click();

      cy.get('[data-testid^="edit-contact-information-button-"]')
        .first()
        .click();
      cy.get('[data-testid="contact.address1"]').clear();
      cy.get('[data-testid="contact.address1"]').type('new address1');
      cy.get('[data-testid="contact.city"]').clear();
      cy.get('[data-testid="contact.city"]').type('new city');
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid^="edit-contact-"]').first().contains('new address1');
      cy.get('[data-testid^="edit-contact-"]').first().contains('new city');

      cy.intercept(
        'POST',
        `/cases/${docketNumber}/generate-notice-of-withdrawal`,
      ).as('generateNoticeOfWithdrawal');

      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.wait('@generateNoticeOfWithdrawal').then(interception => {
        const { petitioners } = interception.request.body;
        expect(petitioners[0].address1).to.equal('new address1');
        expect(petitioners[0].city).to.equal('new city');
      });
    });
  });
  it('should not show the petitioners contact info if it is sealed and only one petitioner exists on case', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="edit-petitioner-button"]').click();
      cy.get('[data-testid="seal-address-label"]').click();
      cy.get('[data-testid="modal-confirm"]').click();

      addPrivatePractitionerToCase(docketNumber, privatePractitioner2BarNumber);
      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });
      loginAsPrivatePractitioner();
      cy.get(`[data-testid="${docketNumber}"] a`).click();
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Notice of Withdrawal as Counsel',
      );
      cy.get('[data-testid="submit-document"]').click();

      cy.get('[data-testid="edit-contact-information-section"]').should(
        'not.exist',
      );
    });
  });

  it.only('should show address sealed for sealed contact info and normal contact info for others', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();

      goToCase(docketNumber);
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="edit-petitioner-button"]').click();
      cy.get('[data-testid="seal-address-label"]').click();
      cy.get('[data-testid="modal-confirm"]').click();

      addPartyPetitionerToCase(docketNumber);

      cy.intercept('GET', `/cases/${docketNumber}`).as('caseDetails');
      goToCase(docketNumber);
      cy.wait('@caseDetails').then(interception => {
        cy.wrap(
          interception.response?.body.petitioners.map(
            (p: RawPetitioner) => p.contactId,
          ),
        ).as('petitionerContactIds');
      });
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="edit-private-practitioner-counsel"]').click();
      cy.get<string[]>('@petitionerContactIds').then(petitionerContactIds => {
        petitionerContactIds.forEach(contactId => {
          cy.get(`input[data-testid="representing-${contactId}"]`).then(
            $checkbox => {
              if (!$checkbox.is(':checked')) {
                cy.get(
                  `label[data-testid="representing-${contactId}"]`,
                ).click();
              }
            },
          );
        });
      });
      cy.get(
        '[data-testid="submit-edit-petitioner-information-button"]',
      ).click();
      addPrivatePractitionerToCase(docketNumber, privatePractitioner2BarNumber);

      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });

      loginAsPrivatePractitioner();
      cy.get(`[data-testid="${docketNumber}"] a`).click();
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Notice of Withdrawal as Counsel',
      );
      cy.get('[data-testid="submit-document"]').click();

      cy.get<string[]>('@petitionerContactIds').then(petitionerContactIds => {
        petitionerContactIds.forEach(contactId => {
          cy.get(`[data-testid="party-label-${contactId}"]`).click();
        });
        cy.get('[data-testid="allPartiesConsent-yes-label"]').click();
        cy.get(
          `[data-testid="edit-contact-${petitionerContactIds[0]}"]`,
        ).contains('ADDRESS SEALED BY COURT ORDER');
        cy.get(
          `[data-testid="edit-contact-${petitionerContactIds[1]}"]`,
        ).should('not.contain', 'ADDRESS SEALED BY COURT ORDER');
        cy.get(
          `[data-testid="edit-contact-information-button-${petitionerContactIds[1]}"]`,
        ).click();
        cy.get('[data-testid="contact.address1"]').clear();
        cy.get('[data-testid="contact.address1"]').type('new address1');
        cy.get('[data-testid="phone-number-input"]').clear();
        cy.get('[data-testid="phone-number-input"]').type('999-999-9999');
        cy.get('[data-testid="modal-button-confirm"]').click();

        cy.intercept(
          'POST',
          `/cases/${docketNumber}/generate-notice-of-withdrawal`,
        ).as('generateNoticeOfWithdrawal');
        cy.get('[data-testid="file-document-submit-document"]').click();
        cy.wait('@generateNoticeOfWithdrawal').then(interception => {
          const { petitioners } = interception.request.body;
          expect(petitioners[1].address1).to.equal('new address1');
          expect(petitioners[1].phone).to.equal('999-999-9999');
        });
      });
    });
  });
});
