import { RawPetitioner } from '@shared/business/entities/contacts/Petitioner';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  calculateISODate,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  loginAsDocketClerk,
  loginAsDocketClerk1,
  loginAsPetitionsClerk,
  loginAsPetitionsClerk1,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { addPetitionerAsPartyToCase } from 'cypress/helpers/caseDetail/caseInformation/add-petitioner-to-case';
import { addPrivatePractitionerToCaseAndAllParties } from 'cypress/helpers/caseDetail/caseInformation/add-private-practitioner-to-case-and-all-parties';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { selectDocumentType } from 'cypress/helpers/caseDetail/select-document-type';
import { petitionsClerkServesPetition } from 'cypress/helpers/documentQC/petitionsclerk-serves-petition';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import { calendarTrialSession } from 'cypress/helpers/trialSession/calendar-trial-session';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { scheduleTrialSession } from 'cypress/helpers/trialSession/schedule-trial-session';
import { updateTrialSessionStartDate } from 'cypress/helpers/trialSession/update-trial-session-start-date';

describe('Notice of Withdrawal - Paper Service', () => {
  const privatePractitioner2BarNumber = 'PT9999';

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

  it('should show paper service acknowledgement when filing as a private practitioner', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });
      loginAsDocketClerk();
      goToCase(docketNumber);
      addPetitionerAsPartyToCase();
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
      cy.get('[data-testid="edit-petitioner-button"]').last().click();
      cy.get('[data-testid="service-type-paper-label-form.contact"]').click();
      cy.intercept('PUT', `/case-parties/${docketNumber}/petitioner-info`).as(
        'updatePetitionerInfo',
      );
      cy.get(
        '[data-testid="submit-edit-petitioner-information-button"]',
      ).click();
      cy.wait('@updatePetitionerInfo').then(interception => {
        cy.wrap(interception.response?.body.paperServiceParties).as(
          'petitionersWithPaperService',
        );
      });

      loginAsPrivatePractitioner();
      selectDocumentType(docketNumber, 'Notice of Withdrawal as Counsel');

      cy.get<RawPetitioner[]>('@petitionersWithPaperService').then(
        petitioners => {
          petitioners.forEach(petitioner => {
            cy.get(
              `[data-testid="paper-service-acknowledgement-name-${petitioner.contactId}"]`,
            ).contains(`${petitioner.name}`);
            cy.get(
              `[data-testid="paper-service-acknowledgement-address-${petitioner.contactId}"]`,
            ).contains(petitioner.address1);
          });
        },
      );
    });
  });
});
