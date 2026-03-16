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
import { addIntervenorAsPartyToCase } from 'cypress/helpers/caseDetail/caseInformation/add-intervenor-to-case';
import { addParticipantAsPartyToCase } from 'cypress/helpers/caseDetail/caseInformation/add-participant-to-case';
import { addPrivatePractitionerToCaseAndAllParties } from 'cypress/helpers/caseDetail/caseInformation/add-private-practitioner-to-case-and-all-parties';
import { petitionsClerkAddsRespondentToCase } from 'cypress/helpers/caseDetail/caseInformation/petitionsclerk-adds-respondent-to-case';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { selectDocumentType } from 'cypress/helpers/caseDetail/select-document-type';
import { petitionsClerkServesPetition } from 'cypress/helpers/documentQC/petitionsclerk-serves-petition';
import { attachSamplePdfFile } from 'cypress/helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import { calendarTrialSession } from 'cypress/helpers/trialSession/calendar-trial-session';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { scheduleTrialSession } from 'cypress/helpers/trialSession/schedule-trial-session';
import { updateTrialSessionStartDate } from 'cypress/helpers/trialSession/update-trial-session-start-date';

describe('Notice of Withdrawal - File Documents', () => {
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

  it('should successfully file manually uploaded notw as private practitioner', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      addParticipantAsPartyToCase();
      goToCase(docketNumber);
      addIntervenorAsPartyToCase();

      cy.intercept('GET', `/cases/${docketNumber}?*`).as('caseDetails');
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
      cy.get('[data-testid="petitioners-and-counsel"]').click();
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

      addPrivatePractitionerToCaseAndAllParties(
        docketNumber,
        privatePractitioner2BarNumber,
      );
      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });

      loginAsPrivatePractitioner();
      selectDocumentType(docketNumber, 'Notice of Withdrawal as Counsel');

      cy.get<string[]>('@petitionerContactIds').then(petitionerContactIds => {
        petitionerContactIds.forEach(contactId => {
          cy.get(`[data-testid="party-label-${contactId}"]`).click();
        });
        cy.get('[data-testid="allPartiesConsent-yes-label"]').click();
      });

      cy.get('[data-testid="manual-generation-label"]').click();
      attachSamplePdfFile('primary-document');
      cy.get('[data-testid="file-document-submit-document"]').click();

      cy.get('[data-testid="filing-parties-card"]').contains('Participant');
      cy.get('[data-testid="filing-parties-card"]').contains('Intervenor');
      cy.get('[data-testid="filing-parties-card"]').contains('Petitioner');
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="success-alert"]').should('be.visible');
      cy.get('[data-testid="docket-record-table"] tr')
        .last()
        .find('[data-testid="docket-entry-filedBy"]')
        .should('contain', 'Test Private Practitioner');
    });
  });

  it('should successfully file manually uploaded notw as irs practitioner', () => {
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
      selectDocumentType(docketNumber, 'Notice of Withdrawal as Counsel');

      cy.get('[data-testid="party-irs-practitioner-label"]').click();
      cy.get('[data-testid="allPartiesConsent-yes-label"]').click();
      cy.get('[data-testid="manual-generation-label"]').click();
      attachSamplePdfFile('primary-document');
      cy.get('[data-testid="file-document-submit-document"]').click();

      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();

      cy.get('[data-testid="success-alert"]').should('be.visible');
      cy.get('[data-testid="docket-record-table"] tr')
        .last()
        .find('[data-testid="docket-entry-filedBy"]')
        .should('contain', 'Test IRS Practitioner1');
    });
  });

  it('should successfully file the auto generated notw as private practitioner for petitioner, intervenor, and participant', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      addParticipantAsPartyToCase();
      goToCase(docketNumber);
      addIntervenorAsPartyToCase();

      cy.intercept('GET', `/cases/${docketNumber}?*`).as('caseDetails');
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
      cy.get('[data-testid="petitioners-and-counsel"]').click();
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

      addPrivatePractitionerToCaseAndAllParties(
        docketNumber,
        privatePractitioner2BarNumber,
      );
      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });

      loginAsPrivatePractitioner();
      selectDocumentType(docketNumber, 'Notice of Withdrawal as Counsel');

      cy.get<string[]>('@petitionerContactIds').then(petitionerContactIds => {
        petitionerContactIds.forEach(contactId => {
          cy.get(`[data-testid="party-label-${contactId}"]`).click();
        });
        cy.get('[data-testid="allPartiesConsent-yes-label"]').click();

        cy.intercept(
          'POST',
          `/cases/${docketNumber}/generate-notice-of-withdrawal`,
        ).as('generateNoticeOfWithdrawal');
        cy.get('[data-testid="file-document-submit-document"]').click();
        cy.wait('@generateNoticeOfWithdrawal').then(interception => {
          const { petitioners } = interception.request.body;
          expect(petitioners.length).to.equal(3);
        });
      });

      cy.get('[data-testid="auto-generated-parties"]').contains('Participant');
      cy.get('[data-testid="auto-generated-parties"]').contains('Intervenor');
      cy.get('[data-testid="auto-generated-parties"]').contains('Petitioner');
      cy.get('[data-testid="submit-auto-generated-document-button"]').click();
      cy.get('[data-testid="success-alert"]').should('be.visible');
    });
  });

  it('should successfully file the auto generated notw as irs practitioner', () => {
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
      selectDocumentType(docketNumber, 'Notice of Withdrawal as Counsel');
      cy.get('[data-testid="party-irs-practitioner-label"]').click();
      cy.get('[data-testid="allPartiesConsent-yes-label"]').click();
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="submit-auto-generated-document-button"]').click();

      cy.get('[data-testid="docket-record-table"] tr')
        .last()
        .find('[data-testid="docket-entry-filedBy"]')
        .should('contain', 'Test IRS Practitioner1');
    });
  });
});
