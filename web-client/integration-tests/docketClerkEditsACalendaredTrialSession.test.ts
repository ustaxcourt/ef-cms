import {
  CASE_STATUS_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { docketClerkVerifiesCaseStatusIsUnchanged } from './journey/docketClerkVerifiesCaseStatusIsUnchanged';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from '../src/presenter/computeds/formattedTrialSessionDetails';
import {
  loginAs,
  setupTest,
  uploadPetition,
  waitForExpectedItem,
  waitForLoadingComponentToHide,
} from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket Clerk edits a calendared trial session', () => {
  const cerebralTest = setupTest();

  const formattedTrialSessionDetails = withAppContextDecorator(
    formattedTrialSessionDetailsComputed,
  );

  const trialLocation = `Helena, Montana, ${Date.now()}`;
  const overrides = {
    fieldToUpdate: 'judge',
    valueToUpdate: {
      name: 'Gustafson',
      userId: 'dabbad05-18d0-43ec-bafb-654e83405416',
    },
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, {
    trialLocation,
  });
  docketClerkViewsTrialSessionList(cerebralTest);

  let caseDetail;
  cerebralTest.casesReadyForTrial = [];

  for (let i = 0; i < 3; i++) {
    loginAs(cerebralTest, 'petitioner@example.com');
    it('login as a petitioner and create 3 cases', async () => {
      caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.casesReadyForTrial.push({
        docketNumber: caseDetail.docketNumber,
      });
      cerebralTest.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkManuallyAddsCaseToTrial(cerebralTest);
  }

  it('verify that there are 3 cases on the trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.caseOrder').length).toBe(3);
  });

  markAllCasesAsQCed(cerebralTest, () =>
    cerebralTest.casesReadyForTrial.map(d => d.docketNumber),
  );
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  it('verify that there are 3 cases on the trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.caseOrder').length).toBe(3);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(cerebralTest, CASE_STATUS_TYPES.closed);

  docketClerkEditsTrialSession(cerebralTest, overrides);

  it('verify that there are 3 cases on the trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.caseOrder').length).toBe(3);
  });

  it('should throw validation error when "Other" is selected and no alternateTrialClerkName provided', async () => {
    await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('EditTrialSession');

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'trialClerkId',
      value: {
        name: 'Other',
        userId: 'Other',
      },
    });
    await cerebralTest.runSequence('updateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      alternateTrialClerkName:
        'A valid alternate trial clerk name must be provided if "Other" is selected',
    });
  });

  it('should set the alternateTrialClerkName', async () => {
    const alternateTrialClerkName = 'Incredible Hulk';
    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'alternateTrialClerkName',
      value: alternateTrialClerkName,
    });
    await cerebralTest.runSequence('updateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForLoadingComponentToHide({ cerebralTest });
    await waitForExpectedItem({
      cerebralTest,
      currentItem: 'currentPage',
      expectedItem: 'PrintPaperTrialNotices',
    });
    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessionDetail');

    const formatted = runCompute(formattedTrialSessionDetails, {
      state: cerebralTest.getState(),
    });

    expect(formatted.formattedTrialClerk).toEqual(alternateTrialClerkName);
  });

  it('should unset the alternateTrialClerkName by setting trial clerk name', async () => {
    const testClerkName = 'Test Clerk';
    await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('EditTrialSession');

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'trialClerkId',
      value: {
        name: testClerkName,
        userId: 'dabbad05-18d0-43ec-bafb-654e83405415',
      },
    });

    await cerebralTest.runSequence('updateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForLoadingComponentToHide({ cerebralTest });
    await waitForExpectedItem({
      cerebralTest,
      currentItem: 'currentPage',
      expectedItem: 'PrintPaperTrialNotices',
    });
    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessionDetail');

    const formatted = runCompute(formattedTrialSessionDetails, {
      state: cerebralTest.getState(),
    });

    expect(formatted.formattedTrialClerk).toEqual(testClerkName);
    expect(
      cerebralTest.getState('trialSession.alternateTrialClerkName'),
    ).toEqual(undefined);
  });

  it('verify that a Notice of Change of Trial Judge was generated for each open case', async () => {
    for (const calendaredCase of cerebralTest.casesReadyForTrial) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: calendaredCase.docketNumber,
      });

      const { docketEntries, status } = cerebralTest.getState('caseDetail');

      const expectedGeneratedNotice = docketEntries.find(
        entry =>
          entry.documentType ===
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge
            .documentType,
      );

      if (status === CASE_STATUS_TYPES.closed) {
        expect(expectedGeneratedNotice).toBeUndefined();
      } else {
        expect(expectedGeneratedNotice).toBeDefined();
      }
    }
  });

  docketClerkVerifiesCaseStatusIsUnchanged(cerebralTest);
});
