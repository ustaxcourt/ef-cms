import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from './formattedTrialSessionDetails';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialClerkUser } from '@shared/test/mockUsers';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedTrialSessionDetails for Reporting sessions', () => {
  const formattedTrialSessionDetails = withAppContextDecorator(
    formattedTrialSessionDetailsComputed,
    applicationContext,
  );

  const startDateWithinReminderRange = calculateISODate({
    howMuch: 29,
    units: 'days',
  });

  const CALENDARED_SESSION = {
    caseOrder: [],
    dismissedAlertForNott: false,
    eligibleCases: [],
    estimatedEndDate: startDateWithinReminderRange,
    irsCalendarAdministrator: 'Test Calendar Admin',
    isCalendared: true,
    judge: { name: 'Test Judge' },
    sessionType: SESSION_TYPES.regular,
    startDate: startDateWithinReminderRange,
    term: 'Fall',
    termYear: '2019',
    trialLocation: 'Hartford, Connecticut',
    trialSessionId: 'abc-123',
  };

  const computeForProceedingType = (proceedingType: string) =>
    runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...CALENDARED_SESSION,
          proceedingType,
          startTime:
            proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.reporting
              ? undefined
              : '10:00',
        },
        user: trialClerkUser,
      },
    });

  it('should NOT show the 30 day notice reminder for a calendared Reporting session with a due date within the reminder range', () => {
    const result = computeForProceedingType(
      TRIAL_SESSION_PROCEEDING_TYPES.reporting,
    );

    expect(result.isReportingSession).toBe(true);
    expect(result.showAlertForNOTTReminder).toBe(false);
    expect(result.alertMessageForNOTT).toBeUndefined();
  });

  it('should still show the 30 day notice reminder for a calendared In Person session with a start date within the reminder range', () => {
    const result = computeForProceedingType(
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    );

    expect(result.isReportingSession).toBe(false);
    expect(result.showAlertForNOTTReminder).toBe(true);
    expect(result.alertMessageForNOTT).toContain(
      '30-day trial notices are due by',
    );
  });
});
