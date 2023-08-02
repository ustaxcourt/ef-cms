import {
  CASE_TYPES_MAP,
  SESSION_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
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

describe('Trial Clerk Views Trial Session Working Copy', () => {
  const cerebralTest = setupTest();

  const trialLocation = `Boise, Idaho, ${Date.now()}`;
  const overrides = {
    maxCases: 3,
    preferredTrialCity: trialLocation,
    sessionType: SESSION_TYPES.small,
    trialClerk: {
      name: 'Test Trial Clerk',
      userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
    },
    trialLocation,
  };
  const createdDocketNumbers: string[] = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest);

  loginAs(cerebralTest, 'trialclerk@example.com');
  trialClerkViewsTrialSessionWorkingCopy(cerebralTest, {
    expectedNumberOfCases: 0,
  });

  const caseOverrides = {
    ...overrides,
    caseType: CASE_TYPES_MAP.deficiency,
    procedureType: 'Small',
    receivedAtDay: '01',
    receivedAtMonth: '01',
    receivedAtYear: '2019',
  };
  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    createdDocketNumbers.push(caseDetail.docketNumber);
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  markAllCasesAsQCed(cerebralTest, () => createdDocketNumbers);
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  loginAs(cerebralTest, 'trialclerk@example.com');
  trialClerkViewsTrialSessionWorkingCopy(cerebralTest);
  trialClerkAddsNotesFromWorkingCopyCaseList(cerebralTest);
  trialClerkViewsNotesFromCaseDetail(cerebralTest);
  trialClerkViewsTrialSessionWorkingCopyWithNotes(cerebralTest);
});
