import { SESSION_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsTrialSessionsTab } from './journey/docketClerkViewsTrialSessionsTab';
import { formattedTrialSessionDetails } from '../src/presenter/computeds/formattedTrialSessionDetails';
import { formattedTrialSessions } from '../src/presenter/computeds/formattedTrialSessions';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkViewsNewTrialSession } from './journey/petitionsClerkViewsNewTrialSession';
import { prepareDateFromString } from '../../shared/src/business/utilities/DateHandler';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionDetailsHelper } from '../src/presenter/computeds/trialSessionDetailsHelper';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Dismiss NOTT reminder on calendared trial session within 30-35 day range', () => {
  const cerebralTest = setupTest();

  const trialLocation = `Seattle, Washington, ${Date.now()}`;

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

  describe('Petitions clerk sets calendar for trial session', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkViewsNewTrialSession(cerebralTest);
    petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
  });

  describe('Docket clerk views calendared trial session in trial session list', () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    it('should see the NOTT reminder icon on the trial session list', async () => {
      await cerebralTest.runSequence('gotoTrialSessionsSequence');

      expect(cerebralTest.getState('currentPage')).toEqual('TrialSessions');

      const trialSessionFormatted: any = runCompute(
        withAppContextDecorator(formattedTrialSessions),
        {
          state: cerebralTest.getState(),
        },
      );

      const filteredSessions: any[] =
        trialSessionFormatted.filteredTrialSessions['Open'];

      let foundSession;
      filteredSessions.some(trialSession => {
        trialSession.sessions.some(session => {
          if (
            session.trialSessionId === cerebralTest.lastCreatedTrialSessionId
          ) {
            foundSession = session;
            return true;
          }
        });
        if (foundSession) {
          return true;
        }
      });

      expect(foundSession).toBeDefined();
      expect(foundSession.showAlertForNOTTReminder).toEqual(true);
      expect(foundSession.alertMessageForNOTT).toEqual(
        `The 30-day notice is due by ${foundSession.thirtyDaysBeforeTrialFormatted}`,
      );
    });

    docketClerkViewsTrialSessionsTab(cerebralTest);

    it('should see the alert banner in the latest trial session but cannot clear it', async () => {
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

      let trialSessionDetailsHelperComputed: any = runCompute(
        withAppContextDecorator(trialSessionDetailsHelper),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(
        trialSessionDetailsHelperComputed.canDismissThirtyDayAlert,
      ).toEqual(false);
    });
  });

  describe('Petitions clerk views calendared trial session in trial session list', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    it('should go to the created trial session', async () => {
      await cerebralTest.runSequence('gotoTrialSessionsSequence', {
        query: {
          status: 'Open',
        },
      });

      expect(cerebralTest.getState('currentPage')).toEqual('TrialSessions');
      expect(
        cerebralTest.getState('screenMetadata.trialSessionFilters.status'),
      ).toEqual('Open');
    });

    it('should see the alert banner in the latest trial session and can clear it', async () => {
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

      let trialSessionDetailsHelperComputed: any = runCompute(
        withAppContextDecorator(trialSessionDetailsHelper),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(
        trialSessionDetailsHelperComputed.canDismissThirtyDayAlert,
      ).toEqual(true);
    });

    it('should dismiss the alert banner and verify that the alert no longer shows up for that trial session', async () => {
      await cerebralTest.runSequence('showThirtyDayNoticeModalSequence');

      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'ServeThirtyDayNoticeModal',
      );

      await cerebralTest.runSequence('dismissThirtyDayTrialAlertSequence');

      expect(cerebralTest.getState('currentPage')).toEqual(
        'TrialSessionDetail',
      );

      const trialSessionDetailsFormatted: any = runCompute(
        withAppContextDecorator(formattedTrialSessionDetails),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(trialSessionDetailsFormatted.showAlertForNOTTReminder).toBe(false);
    });
  });
});
