import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  calculateISODate,
  createISODateAtStartOfDayEST,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  loginAsDocketClerk,
  loginAsPetitionsClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { calendarTrialSession } from 'cypress/helpers/trialSession/calendar-trial-session';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { scheduleTrialSession } from 'cypress/helpers/trialSession/schedule-trial-session';

describe('user runs a case deadlines report', () => {
  const today = createISODateAtStartOfDayEST(); // start of today EST
  const tomorrow = calculateISODate({
    dateString: today,
    howMuch: 1,
    units: 'days',
  });
  const deadlineDescription = 'test deadline description';
  const judge = 'Carluzzo';

  it('should update the header', () => {
    setupCaseDeadlineReportFixture({
      deadlineDescription,
      judge,
      tomorrow,
    }).then(() => {
      openCaseDeadlinesReport({ judge, today, tomorrow });

      cy.get('[data-testid="case-deadline-report-header"]').should(
        'contain.text',
        formatDateString(today, FORMATS.MONTH_DAY_YEAR),
      );
      cy.get('[data-testid="case-deadline-report-header"]').should(
        'contain.text',
        formatDateString(tomorrow, FORMATS.MONTH_DAY_YEAR),
      );
    });
  });

  it('should display deadlines in the list', () => {
    setupCaseDeadlineReportFixture({
      deadlineDescription,
      judge,
      tomorrow,
    }).then(() => {
      openCaseDeadlinesReport({ judge, today, tomorrow });

      cy.get('[data-testid="case-deadlines-report-table-body"]').should(
        'contain.text',
        formatDateString(tomorrow, FORMATS.MMDDYY),
      );
      cy.get('[data-testid="case-deadlines-report-table-body"]').should(
        'contain.text',
        deadlineDescription,
      );
    });
  });
});

const setupCaseDeadlineReportFixture = ({
  deadlineDescription,
  judge,
  tomorrow,
}: {
  deadlineDescription: string;
  judge: string;
  tomorrow: string;
}): Cypress.Chainable<string> => {
  loginAsPetitionsClerk1();

  return createTrialSession({ judge }).then(({ trialSessionId }) => {
    return createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk();
      goToCase(docketNumber);
      updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
      calendarTrialSession(trialSessionId);
      scheduleTrialSession(docketNumber, trialSessionId);

      loginAsDocketClerk();
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-create-deadline"]').click();
      cy.get('#deadline-date-picker').clear();
      cy.get('#deadline-date-picker').type(
        formatDateString(tomorrow, FORMATS.MMDDYYYY),
      );
      cy.get('[data-testid="case-deadline-description-input"]').type(
        deadlineDescription,
      );
      cy.get('[data-testid="modal-button-confirm"]').click();

      return cy.wrap(docketNumber);
    });
  });
};

const openCaseDeadlinesReport = ({
  judge,
  today,
  tomorrow,
}: {
  judge: string;
  today: string;
  tomorrow: string;
}): void => {
  loginAsDocketClerk();
  cy.get('[data-testid="dropdown-select-report"]').click();
  cy.get('#all-deadlines').click();

  cy.get('#deadlineStart-date-start').clear();
  cy.get('#deadlineStart-date-start').type(
    formatDateString(today, FORMATS.MMDDYYYY),
  );
  cy.get('#deadlineEnd-date-end').clear();
  cy.get('#deadlineEnd-date-end').type(
    formatDateString(tomorrow, FORMATS.MMDDYYYY),
  );
  cy.get(
    '[aria-describedby="case-deadlines-tab case-deadlines-filter-label"]',
  ).select(judge);
  cy.get('[data-testid="submit-case-deadlines-report-button"]').click();
};
