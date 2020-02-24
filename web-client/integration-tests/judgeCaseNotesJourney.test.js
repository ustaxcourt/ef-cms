import { setupTest, uploadPetition } from './helpers';
import captureCreatedCase from './journey/captureCreatedCase';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSetsCaseReadyForTrial from './journey/docketClerkSetsCaseReadyForTrial';
import docketClerkViewsNewTrialSession from './journey/docketClerkViewsNewTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import judgeAddsNotesFromWorkingCopyCaseList from './journey/judgeAddsNotesFromWorkingCopyCaseList';
import judgeLogIn from './journey/judgeLogIn';
import judgeSignsOut from './journey/judgeSignsOut';
import judgeViewsNotesFromCaseDetail from './journey/judgeViewsNotesFromCaseDetail';
import judgeViewsTrialSessionWorkingCopy from './journey/judgeViewsTrialSessionWorkingCopy';
import markAllCasesAsQCed from './journey/markAllCasesAsQCed';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkUpdatesFiledBy from './journey/petitionsClerkUpdatesFiledBy';
import userSignsOut from './journey/petitionerSignsOut';

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
  const createdCases = [];
  const createdDocketNumbers = [];

  docketClerkLogIn(test);
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  docketClerkViewsNewTrialSession(test);
  userSignsOut(test);

  const caseOverrides = {
    ...overrides,
    caseType: 'Deficiency',
    procedureType: 'Small',
    receivedAtDay: '01',
    receivedAtMonth: '01',
    receivedAtYear: '2019',
  };
  petitionerLogin(test);
  it('Create case', async () => {
    await uploadPetition(test, caseOverrides);
  });
  petitionerViewsDashboard(test);
  captureCreatedCase(test, createdCases, createdDocketNumbers);
  userSignsOut(test);
  petitionsClerkLogIn(test);
  petitionsClerkUpdatesFiledBy(test, caseOverrides);
  petitionsClerkSubmitsCaseToIrs(test);
  userSignsOut(test);

  docketClerkLogIn(test);
  docketClerkSetsCaseReadyForTrial(test);
  userSignsOut(test);

  petitionsClerkLogIn(test);
  markAllCasesAsQCed(test, () => createdCases);
  petitionsClerkSetsATrialSessionsSchedule(test);
  userSignsOut(test);

  judgeLogIn(test, 'judgeCohen');
  judgeViewsTrialSessionWorkingCopy(test);
  judgeAddsNotesFromWorkingCopyCaseList(test);
  judgeViewsNotesFromCaseDetail(test);
  judgeSignsOut(test);
});
