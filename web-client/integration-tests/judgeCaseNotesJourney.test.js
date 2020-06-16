import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { judgeAddsNotesFromWorkingCopyCaseList } from './journey/judgeAddsNotesFromWorkingCopyCaseList';
import { judgeViewsNotesFromCaseDetail } from './journey/judgeViewsNotesFromCaseDetail';
import { judgeViewsTrialSessionWorkingCopy } from './journey/judgeViewsTrialSessionWorkingCopy';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

const test = setupTest();

describe('Trial Session Eligible Cases Journey (judge)', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });
  const trialLocation = `Boise, Idaho, ${Date.now()}`;
  const overrides = {
    maxCases: 3,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };
  const createdCaseIds = [];
  const createdDocketNumbers = [];

  loginAs(test, 'docketclerk');
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  docketClerkViewsNewTrialSession(test);

  const caseOverrides = {
    ...overrides,
    caseType: 'Deficiency',
    procedureType: 'Small',
    receivedAtDay: '01',
    receivedAtMonth: '01',
    receivedAtYear: '2019',
  };
  loginAs(test, 'petitioner');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    createdCaseIds.push(caseDetail.caseId);
    createdDocketNumbers.push(caseDetail.docketNumber);
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkSubmitsCaseToIrs(test);

  loginAs(test, 'docketclerk');
  docketClerkSetsCaseReadyForTrial(test);

  loginAs(test, 'petitionsclerk');
  markAllCasesAsQCed(test, () => createdCaseIds);
  petitionsClerkSetsATrialSessionsSchedule(test);

  loginAs(test, 'judgeCohen');
  judgeViewsTrialSessionWorkingCopy(test);
  judgeAddsNotesFromWorkingCopyCaseList(test);
  judgeViewsNotesFromCaseDetail(test);
});
