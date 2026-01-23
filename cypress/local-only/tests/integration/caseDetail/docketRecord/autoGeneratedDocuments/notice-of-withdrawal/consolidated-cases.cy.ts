import {
  calculateISODate,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  loginAsDocketClerk1,
  loginAsIrsPractitioner1,
  loginAsPetitionsClerk,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { addPrivatePractitionerToCaseAndAllParties } from 'cypress/helpers/caseDetail/caseInformation/add-private-practitioner-to-case-and-all-parties';
import { petitionsClerkAddsRespondentToCase } from 'cypress/helpers/caseDetail/caseInformation/petitionsclerk-adds-respondent-to-case';
import { goToCaseFromDashboard } from 'cypress/helpers/caseDetail/go-to-case';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';
import { createAndServeConsolidatedGroup } from 'cypress/helpers/fileAPetition/create-consolidated-case-group';
import { calendarTrialSession } from 'cypress/helpers/trialSession/calendar-trial-session';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { scheduleTrialSession } from 'cypress/helpers/trialSession/schedule-trial-session';
import { updateTrialSessionStartDate } from 'cypress/helpers/trialSession/update-trial-session-start-date';

describe('Notice of Withdrawal - Consolidated Cases', () => {
  const privatePractitionerBarNumber = 'PT5432';
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
      createAndServeConsolidatedGroup({}).then(({ leadDocketNumber }) => {
        cy.wrap(leadDocketNumber).as('docketNumber');
        calendarTrialSession(trialSessionId);
        scheduleTrialSession(leadDocketNumber, trialSessionId);
        loginAsDocketClerk1();
        addPrivatePractitionerToCaseAndAllParties(
          leadDocketNumber,
          privatePractitionerBarNumber,
        );
      });
    });
  });

  it('should show alert when filing notw on consolidated group case for both private and irs practitioners', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      // Setup for private practitioner test
      loginAsDocketClerk1();
      addPrivatePractitionerToCaseAndAllParties(
        docketNumber,
        privatePractitioner2BarNumber,
      );
      cy.get<string>('@trialSessionId').then(trialSessionId => {
        updateTrialSessionStartDate(trialSessionId, validFutureDate);
      });

      // Test private practitioner alert
      loginAsPrivatePractitioner();
      enterNoticeOfWithdrawalFormType(docketNumber);
      cy.get(
        '[data-testid="alert-warning-consolidated-case-alert-warning"]',
      ).should('be.visible');
      cy.get(
        '[data-testid="alert-warning-consolidated-case-alert-warning"]',
      ).contains(
        'If you are withdrawing as counsel from more than one case you must file a Notice of Withdrawal as Counsel for each case.',
      );

      // Add respondents for IRS practitioner test
      loginAsDocketClerk1();
      petitionsClerkAddsRespondentToCase(
        docketNumber,
        irsPractitionerBarNumber,
      );
      petitionsClerkAddsRespondentToCase(
        docketNumber,
        irsPractitioner2BarNumber,
      );

      // Test IRS practitioner alert
      loginAsIrsPractitioner1();
      enterNoticeOfWithdrawalFormType(docketNumber);
      cy.get(
        '[data-testid="alert-warning-consolidated-case-alert-warning"]',
      ).should('be.visible');
      cy.get(
        '[data-testid="alert-warning-consolidated-case-alert-warning"]',
      ).contains(
        'If you are withdrawing as counsel from more than one case you must file a Notice of Withdrawal as Counsel for each case.',
      );
    });
  });
});

const enterNoticeOfWithdrawalFormType = (docketNumber: string) => {
  goToCaseFromDashboard(docketNumber);
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();
  selectTypeaheadInput(
    'complete-doc-document-type-search',
    'Notice of Withdrawal as Counsel',
  );
  cy.get('[data-testid="submit-document"]').click();
};
