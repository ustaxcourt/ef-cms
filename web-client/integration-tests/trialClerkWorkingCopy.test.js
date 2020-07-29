import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { trialClerkAddsNotesFromWorkingCopyCaseList } from './journey/trialClerkAddsNotesFromWorkingCopyCaseList';
import { trialClerkViewsNotesFromCaseDetail } from './journey/trialClerkViewsNotesFromCaseDetail';
import { trialClerkViewsTrialSessionWorkingCopy } from './journey/trialClerkViewsTrialSessionWorkingCopy';
import { trialClerkViewsTrialSessionWorkingCopyWithNotes } from './journey/trialClerkViewsTrialSessionWorkingCopyWithNotes';

const test = setupTest();
const { CASE_TYPES_MAP } = applicationContext.getConstants();

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
  const createdDocketNumbers = [];

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  docketClerkViewsNewTrialSession(test);

  const caseOverrides = {
    ...overrides,
    caseType: CASE_TYPES_MAP.deficiency,
    procedureType: 'Small',
    receivedAtDay: '01',
    receivedAtMonth: '01',
    receivedAtYear: '2019',
  };
  loginAs(test, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    createdDocketNumbers.push(caseDetail.docketNumber);
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(test);

  loginAs(test, 'petitionsclerk@example.com');
  markAllCasesAsQCed(test, () => createdDocketNumbers);
  petitionsClerkSetsATrialSessionsSchedule(test);

  loginAs(test, 'trialclerk@example.com');
  trialClerkViewsTrialSessionWorkingCopy(test);
  trialClerkAddsNotesFromWorkingCopyCaseList(test);
  trialClerkViewsNotesFromCaseDetail(test);
  trialClerkViewsTrialSessionWorkingCopyWithNotes(test);
});
