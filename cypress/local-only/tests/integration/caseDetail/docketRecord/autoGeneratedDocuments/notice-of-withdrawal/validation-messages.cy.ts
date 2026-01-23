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
import { addPrivatePractitionerToCaseAndAllParties } from 'cypress/helpers/caseDetail/caseInformation/add-private-practitioner-to-case-and-all-parties';
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

describe('Notice of Withdrawal - Validation Messages', () => {
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

  it('should show validation messages for private practitioner when selecting form type', () => {
    loginAsPrivatePractitioner();
    cy.get<string>('@docketNumber').then(docketNumber => {
      enterNoticeOfWithdrawalFormType(docketNumber);
      cy.get('[data-testid="error-alert"]').should('be.visible');
      cy.get('[data-testid="error-alert"]').contains(
        'You are the only counsel representing a party on this case.',
      );
      cy.get('[data-testid="error-alert"]').contains(
        'The case is scheduled for trial in less than 30 days.',
      );
    });
  });

  it('should show validation messages for irs practitioners when selecting form type', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      petitionsClerkAddsRespondentToCase(docketNumber, irsPractitionerBarNumber);
      loginAsIrsPractitioner1();
      enterNoticeOfWithdrawalFormType(docketNumber);
      cy.get('[data-testid="error-alert"]').should('be.visible');
      cy.get('[data-testid="error-alert"]').contains(
        'You are the only counsel representing a party on this case.',
      );
      cy.get('[data-testid="error-alert"]').contains(
        'The case is scheduled for trial in less than 30 days.',
      );
    });
  });

  it('should show validation messages for private practitioners when trying to review filing', () => {
    loginAsDocketClerk1();
    cy.get<string>('@docketNumber').then(docketNumber => {
      addPrivatePractitionerToCaseAndAllParties(
        docketNumber,
        privatePractitioner2BarNumber,
      );
      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });

      loginAsPrivatePractitioner();
      enterNoticeOfWithdrawalFormType(docketNumber);
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="error-alert"]').should('be.visible');
      cy.get('[data-testid="error-alert"]').contains('Select a filing party');
      cy.get('[data-testid="error-alert"]').contains(
        'All parties have not consented to your withdrawal as counsel.',
      );
    });
  });

  it('should show validation messages for irs practitioner when trying to review filing', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      petitionsClerkAddsRespondentToCase(docketNumber, irsPractitionerBarNumber);
      petitionsClerkAddsRespondentToCase(docketNumber, irsPractitioner2BarNumber);

      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });

      loginAsIrsPractitioner1();
      enterNoticeOfWithdrawalFormType(docketNumber);
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="error-alert"]').should('be.visible');
      cy.get('[data-testid="error-alert"]').contains('Select a filing party');
      cy.get('[data-testid="error-alert"]').contains(
        'All parties have not consented to your withdrawal as counsel.',
      );
    });
  });
});

const enterNoticeOfWithdrawalFormType = (docketNumber: string) => {
  goToCase(docketNumber);
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();
  selectTypeaheadInput(
    'complete-doc-document-type-search',
    'Notice of Withdrawal as Counsel',
  );
  cy.get('[data-testid="submit-document"]').click();
};
