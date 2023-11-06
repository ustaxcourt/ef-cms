import {
  PAYMENT_STATUS,
  SESSION_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { fakeFile, loginAs, setupTest, waitForExpectedItem } from './helpers';
import { formattedTrialSessionDetails } from '@web-client/presenter/computeds/formattedTrialSessionDetails';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkReviewsPaperCaseBeforeServing } from './journey/petitionsClerkReviewsPaperCaseBeforeServing';
import { petitionsClerkServesPaperCaseToIRS } from './petitionsClerkServesPaperCaseToIRS';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkViewsNewTrialSession } from './journey/petitionsClerkViewsNewTrialSession';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('petitions clerk calendars a trial session and verifies the paper pdf links persist', () => {
  const cerebralTest = setupTest();

  const trialLocation = `Denver, Colorado, ${Date.now()}`;
  const overrides = {
    maxCases: 100,
    preferredTrialCity: trialLocation,
    sessionType: SESSION_TYPES.small,
    trialLocation,
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe(`Create trial session with Small session type for '${trialLocation}'`, () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(cerebralTest, overrides);
    docketClerkViewsTrialSessionList(cerebralTest);
    docketClerkViewsNewTrialSession(cerebralTest);
  });

  describe('creates a paper case', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');

    petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile, {
      paymentStatus: PAYMENT_STATUS.UNPAID,
      trialLocation,
    });

    petitionsClerkReviewsPaperCaseBeforeServing(cerebralTest, {
      hasIrsNoticeFormatted: 'No',
      ordersAndNoticesInDraft: [
        'Order Designating Place of Trial',
        'Order for Filing Fee',
      ],
      ordersAndNoticesNeeded: ['Order for Ratification of Petition'],
      petitionPaymentStatusFormatted: PAYMENT_STATUS.UNPAID,
      receivedAtFormatted: '01/01/01',
      shouldShowIrsNoticeDate: false,
    });

    petitionsClerkServesPaperCaseToIRS(cerebralTest);

    it('track docket number', () => {
      cerebralTest.casesReadyForTrial = [cerebralTest.docketNumber];
    });

    petitionsClerkManuallyAddsCaseToTrial(cerebralTest);
  });

  describe('petitions clerk sets calendar for trial session', () => {
    petitionsClerkViewsNewTrialSession(cerebralTest);
    markAllCasesAsQCed(cerebralTest, () => [cerebralTest.docketNumber]);
    petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

    it('petitions clerk should be redirected to print paper service for the trial session', () => {
      expect(cerebralTest.getState('currentPage')).toEqual(
        'PrintPaperTrialNotices',
      );
    });

    it('petitions clerk verifies that the case was set on the trial session', async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      const trialSessionFormatted = runCompute(
        withAppContextDecorator(formattedTrialSessionDetails),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(
        trialSessionFormatted.openCases.find(
          aCase => aCase.docketNumber === cerebralTest.docketNumber,
        ),
      ).toBeDefined();
    });
  });

  describe('petitions clerk edits the trial session', () => {
    it('edits a trial session to have a new judge', async () => {
      await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
        key: 'judge',
        value: {
          name: 'Gustafson',
          userId: 'dabbad05-18d0-43ec-bafb-654e83405416',
        },
      });

      await cerebralTest.runSequence('updateTrialSessionSequence');

      await waitForExpectedItem({
        cerebralTest,
        currentItem: 'currentPage',
        expectedItem: 'PrintPaperTrialNotices',
      });

      await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      await cerebralTest.runSequence('openPrintGeneratedPaperServiceSequence');

      const trialSessionFormatted = runCompute(
        withAppContextDecorator(formattedTrialSessionDetails),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(trialSessionFormatted.paperServicePdfs.length).toEqual(2);
    });
  });
});
