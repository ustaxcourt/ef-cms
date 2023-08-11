import {
  PROCEDURE_TYPES_MAP,
  SESSION_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { formattedTrialSessionDetails } from '../src/presenter/computeds/formattedTrialSessionDetails';
import { loginAs, setupTest, waitForCondition } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkViewsNewTrialSession } from './journey/petitionsClerkViewsNewTrialSession';
import { prepareDateFromString } from '../../shared/src/business/utilities/DateHandler';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionDetailsHelper } from '../src/presenter/computeds/trialSessionDetailsHelper';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Serve NOTTs from reminder on calendared trial session detail page', () => {
  const cerebralTest = setupTest();

  cerebralTest.casesReadyForTrial = [];

  const trialLocation = 'Los Angeles, California';

  const currentDate = prepareDateFromString().plus({
    ['days']: 30,
  });

  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: SESSION_TYPES.small,
    trialDay:
      currentDate.day.toString().length === 1
        ? '0' + currentDate.day
        : currentDate.day,
    trialLocation,
    trialMonth:
      currentDate.month.toString().length === 1
        ? '0' + currentDate.month
        : currentDate.month,
    trialYear: currentDate.year.toString(),
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe(`Docket clerk creates Small trial session in '${trialLocation}'`, () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(cerebralTest, overrides);
  });

  describe('Petitions clerk sets calendar for trial session and manually adds cases to the trial session', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesNewCase(cerebralTest, {
      procedureType: PROCEDURE_TYPES_MAP.regular,
      shouldServe: true,
      trialLocation,
    });
    petitionsClerkCreatesNewCase(cerebralTest, {
      procedureType: PROCEDURE_TYPES_MAP.regular,
      shouldServe: true,
      trialLocation,
    });
    petitionsClerkViewsNewTrialSession(cerebralTest);
    petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

    it('Petitions clerk manually adds a case to a trial session', async () => {
      for (const docketNumber of cerebralTest.casesReadyForTrial) {
        await cerebralTest.runSequence('gotoCaseDetailSequence', {
          docketNumber,
        });

        await cerebralTest.runSequence('openAddToTrialModalSequence');
        await cerebralTest.runSequence('updateModalValueSequence', {
          key: 'trialSessionId',
          value: cerebralTest.trialSessionId,
        });

        await cerebralTest.runSequence('addCaseToTrialSessionSequence');
      }
    });

    it('Petitions clerk manually removes a case from the trial session', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.casesReadyForTrial[0],
      });

      await cerebralTest.runSequence('openRemoveFromTrialSessionModalSequence');
      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'disposition',
        value: 'Test disposition',
      });

      await cerebralTest.runSequence('removeCaseFromTrialSequence');
    });
  });

  describe('Petitions clerk serves NOTT reminders for the calendared trial session', () => {
    it('should go to the created trial session', async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });
    });

    it('should see the alert banner in the calendared trial session', async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      const trialSessionDetailsFormatted: any = runCompute(
        withAppContextDecorator(formattedTrialSessionDetails),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(trialSessionDetailsFormatted.alertMessageForNOTT).toEqual(
        `30-day trial notices are due by ${trialSessionDetailsFormatted.thirtyDaysBeforeTrialFormatted}. Have notices been served?`,
      );
    });

    it('should serve the NOTT reminders for the trial session', async () => {
      await cerebralTest.runSequence('showThirtyDayNoticeModalSequence');

      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'ServeThirtyDayNoticeModal',
      );

      await cerebralTest.runSequence('serveThirtyDayNoticeOfTrialSequence');

      await waitForCondition({
        booleanExpressionCondition: () =>
          cerebralTest.getState('currentPage') === 'PrintPaperTrialNotices',
      });

      expect(cerebralTest.getState('currentPage')).toEqual(
        'PrintPaperTrialNotices',
      );

      await cerebralTest.runSequence(
        'printPaperServiceForTrialCompleteSequence',
      );

      const trialSessionDetailsFormatted: any = runCompute(
        withAppContextDecorator(formattedTrialSessionDetails),
        {
          state: cerebralTest.getState(),
        },
      );

      const trialSessionDetailsHelperComputed: any = runCompute(
        withAppContextDecorator(trialSessionDetailsHelper),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(trialSessionDetailsFormatted.showAlertForNOTTReminder).toBe(true);
      expect(trialSessionDetailsHelperComputed.nottReminderAction).toBe(
        'Yes, Dismiss',
      );
    });

    it('should verify that an NOTT has NOT been added to the docket record for a case that has been removed from the trial session', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.casesReadyForTrial[0],
      });

      const { docketEntries } = cerebralTest.getState('caseDetail');
      const nottDocketEntry = docketEntries.find(
        doc => doc.eventCode === 'NOTT',
      );

      expect(nottDocketEntry).toBeUndefined();
    });

    it('should verify that the NOTT has been added to the docket record for an open case on the trial session', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.casesReadyForTrial[1],
      });

      const { docketEntries } = cerebralTest.getState('caseDetail');
      const nottDocketEntry = docketEntries.find(
        doc => doc.eventCode === 'NOTT',
      );

      expect(nottDocketEntry.documentTitle).toBe(
        `30 Day Notice of Trial on ${overrides.trialMonth}-${overrides.trialDay}-${overrides.trialYear} at ${trialLocation}`,
      );
    });
  });
});
