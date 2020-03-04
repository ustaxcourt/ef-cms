import { setupTest, uploadPetition } from './helpers';
import captureCreatedCase from './journey/captureCreatedCase';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSetsCaseReadyForTrial from './journey/docketClerkSetsCaseReadyForTrial';
import docketClerkViewsNewTrialSession from './journey/docketClerkViewsNewTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import markAllCasesAsQCed from './journey/markAllCasesAsQCed';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkUpdatesFiledBy from './journey/petitionsClerkUpdatesFiledBy';
import trialClerkAddsNotesFromWorkingCopyCaseList from './journey/trialClerkAddsNotesFromWorkingCopyCaseList';
import trialClerkLogIn from './journey/trialClerkLogIn';
import trialClerkViewsNotesFromCaseDetail from './journey/trialClerkViewsNotesFromCaseDetail';
import trialClerkViewsTrialSessionWorkingCopy from './journey/trialClerkViewsTrialSessionWorkingCopy';

import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('Trial Clerk Views Trial Session Working Copy', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  const trialLocation = `Boise, Idaho, ${Date.now()}`;
  const overrides = {
    maxCases: 3,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialClerk: {
      name: 'Test Trial Clerk',
      userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
    },
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

  trialClerkLogIn(test);
  trialClerkViewsTrialSessionWorkingCopy(test);
  trialClerkAddsNotesFromWorkingCopyCaseList(test);
  trialClerkViewsNotesFromCaseDetail(test);
  userSignsOut(test);
});
