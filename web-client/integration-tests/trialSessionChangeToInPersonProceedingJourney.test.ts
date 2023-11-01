import {
  CASE_TYPES_MAP,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  waitForExpectedItem,
  waitForLoadingComponentToHide,
} from './helpers';
import { manuallyAddCaseToTrial } from './utils/manuallyAddCaseToTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

describe('petitions clerk sets a remote trial session calendar', () => {
  const cerebralTest = setupTest();

  const trialLocation = `Denver, Colorado, ${Date.now()}`;
  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('docket clerk created a location based remote trial session', async () => {
    await cerebralTest.runSequence('gotoAddTrialSessionSequence');

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'proceedingType',
      value: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'maxCases',
      value: overrides.maxCases || 100,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'sessionType',
      value: overrides.sessionType || 'Hybrid',
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'startDate',
        toFormat: FORMATS.ISO,
        value: '12/12/2025',
      },
    );

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'trialLocation',
      value: overrides.trialLocation || 'Seattle, Washington',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'meetingId',
      value: '123456789',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'password',
      value: '123456789',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'joinPhoneNumber',
      value: '123456789',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'chambersPhoneNumber',
      value: '123456789',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'judge',
      value: {
        name: 'Cohen',
        userId: 'dabbad04-18d0-43ec-bafb-654e83405416',
      },
    });

    await cerebralTest.runSequence('validateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitTrialSessionSequence');

    expect(cerebralTest.getState('alertSuccess')).toEqual({
      message: 'Trial session added.',
    });

    const lastCreatedTrialSessionId = cerebralTest.getState(
      'lastCreatedTrialSessionId',
    );
    expect(lastCreatedTrialSessionId).toBeDefined();

    cerebralTest.trialSessionId = lastCreatedTrialSessionId;
    cerebralTest.lastCreatedTrialSessionId = lastCreatedTrialSessionId;
  });

  docketClerkViewsTrialSessionList(cerebralTest);

  const caseOverrides = {
    ...overrides,
    caseType: CASE_TYPES_MAP.cdp,
    procedureType: 'Small',
  };

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case and set ready for trial', async () => {
    const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  manuallyAddCaseToTrial(cerebralTest);
  it('mark case as QCd', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('updateQcCompleteForTrialSequence', {
      docketNumber: cerebralTest.docketNumber,
      qcCompleteForTrial: true,
    });
  });
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  it('Petitions clerk edits a remote trial session to be in person', async () => {
    await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'proceedingType',
      value: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    });

    await cerebralTest.runSequence('updateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForLoadingComponentToHide({ cerebralTest });
    await waitForExpectedItem({
      cerebralTest,
      currentItem: 'currentPage',
      expectedItem: 'TrialSessionDetail',
    });
    expect(cerebralTest.getState('currentPage')).toBe('TrialSessionDetail');
  });

  it('Petitions clerk verifies NOIP docket entries for open cases', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetail = cerebralTest.getState('caseDetail');

    const noipDocketEntry = caseDetail.docketEntries.find(
      ({ eventCode }) =>
        eventCode ===
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToInPersonProceeding
          .eventCode,
    );

    await waitForLoadingComponentToHide({ cerebralTest });
    expect(noipDocketEntry).toMatchObject({
      servedParties: [
        {
          name: 'Mona Schultz',
        },
      ],
    });
  });
});
