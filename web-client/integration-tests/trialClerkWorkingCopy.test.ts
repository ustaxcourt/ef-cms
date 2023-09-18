import {
  CASE_TYPES_MAP,
  SESSION_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { createConsolidatedGroup } from './journey/consolidation/createConsolidatedGroup';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialClerkAddsNotesFromWorkingCopyCaseList } from './journey/trialClerkAddsNotesFromWorkingCopyCaseList';
import { trialClerkViewsNotesFromCaseDetail } from './journey/trialClerkViewsNotesFromCaseDetail';
import { trialClerkViewsTrialSessionWorkingCopy } from './journey/trialClerkViewsTrialSessionWorkingCopy';
import { trialClerkViewsTrialSessionWorkingCopyWithNotes } from './journey/trialClerkViewsTrialSessionWorkingCopyWithNotes';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from '@web-client/presenter/computeds/trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('Trial Clerk Views Trial Session Working Copy', () => {
  const cerebralTest = setupTest();
  const trialSessionWorkingCopyHelper = withAppContextDecorator(
    trialSessionWorkingCopyHelperComputed,
  );

  const trialLocation = `Boise, Idaho, ${Date.now()}`;
  const overrides = {
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
    procedureType: SESSION_TYPES.small,
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

  createConsolidatedGroup(
    cerebralTest,
    {
      preferredTrialCity: trialLocation,
      procedureType: SESSION_TYPES.small,
    },
    2,
  );

  it('save scheduledLeadCaseDocketNumber', async () => {
    createdDocketNumbers.push(
      cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries[0],
    );
    createdDocketNumbers.push(
      cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries[2],
    );
  });

  createConsolidatedGroup(cerebralTest, {
    preferredTrialCity: trialLocation,
    procedureType: SESSION_TYPES.small,
  });
  it('save scheduledLeadCaseDocketNumber', async () => {
    createdDocketNumbers.push(
      cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries[1],
    );
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  markAllCasesAsQCed(cerebralTest, () => createdDocketNumbers);
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  loginAs(cerebralTest, 'trialclerk@example.com');
  trialClerkViewsTrialSessionWorkingCopy(cerebralTest, {
    expectedNumberOfCases: 4,
  });
  it('assertions', () => {
    const helperData = runCompute(trialSessionWorkingCopyHelper, {
      state: cerebralTest.getState(),
    });

    expect(helperData.formattedCases.length).toEqual(3);
    expect(helperData.formattedCases[0].shouldIndent).toEqual(false);
    expect(helperData.formattedCases[0].inConsolidatedGroup).toEqual(false);
    expect(helperData.formattedCases[0].isLeadCase).toEqual(false);

    expect(helperData.formattedCases[1].shouldIndent).toEqual(false);
    expect(helperData.formattedCases[1].inConsolidatedGroup).toEqual(true);
    expect(helperData.formattedCases[1].isLeadCase).toEqual(true);

    expect(helperData.formattedCases[1].nestedConsolidatedCases.length).toEqual(
      1,
    );
    expect(
      helperData.formattedCases[1].nestedConsolidatedCases[0].shouldIndent,
    ).toEqual(true);
    expect(
      helperData.formattedCases[1].nestedConsolidatedCases[0]
        .inConsolidatedGroup,
    ).toEqual(true);
    expect(
      helperData.formattedCases[1].nestedConsolidatedCases[0].isLeadCase,
    ).toEqual(false);

    expect(helperData.formattedCases[2].shouldIndent).toEqual(false);
    expect(helperData.formattedCases[2].inConsolidatedGroup).toEqual(true);
    expect(helperData.formattedCases[2].isLeadCase).toEqual(false);
  });

  trialClerkAddsNotesFromWorkingCopyCaseList(cerebralTest);
  trialClerkViewsNotesFromCaseDetail(cerebralTest);
  trialClerkViewsTrialSessionWorkingCopyWithNotes(cerebralTest);
});
