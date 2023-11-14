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

  it('save Lead Case and member case docket numbers', () => {
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
  it('save member case that has no lead case in trial session', () => {
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

  it('Trial Session Working Copy Table Formatting', () => {
    const helperData = runCompute(trialSessionWorkingCopyHelper, {
      state: cerebralTest.getState(),
    });

    expect(helperData.formattedCases.length).toEqual(3);
    const [
      soloCase,
      leadCaseWithAGroupedCase,
      memberCaseWithNoLeadInTrialSession,
    ] = helperData.formattedCases;

    expect(soloCase.shouldIndent).toEqual(false);
    expect(soloCase.inConsolidatedGroup).toEqual(false);
    expect(soloCase.isLeadCase).toEqual(false);

    expect(leadCaseWithAGroupedCase.shouldIndent).toEqual(false);
    expect(leadCaseWithAGroupedCase.inConsolidatedGroup).toEqual(true);
    expect(leadCaseWithAGroupedCase.isLeadCase).toEqual(true);

    expect(leadCaseWithAGroupedCase.nestedConsolidatedCases.length).toEqual(1);
    const groupedCase = leadCaseWithAGroupedCase.nestedConsolidatedCases[0];
    expect(groupedCase.shouldIndent).toEqual(true);
    expect(groupedCase.inConsolidatedGroup).toEqual(true);
    expect(groupedCase.isLeadCase).toEqual(false);

    expect(memberCaseWithNoLeadInTrialSession.shouldIndent).toEqual(false);
    expect(memberCaseWithNoLeadInTrialSession.inConsolidatedGroup).toEqual(
      true,
    );
    expect(memberCaseWithNoLeadInTrialSession.isLeadCase).toEqual(false);
  });

  trialClerkAddsNotesFromWorkingCopyCaseList(cerebralTest);
  trialClerkViewsNotesFromCaseDetail(cerebralTest);
  trialClerkViewsTrialSessionWorkingCopyWithNotes(cerebralTest);

  it('navigate to printable working copy', async () => {
    jest.spyOn(
      cerebralTest.applicationContext.getUseCases(),
      'generatePrintableTrialSessionCopyReportInteractor',
    );

    runCompute(trialSessionWorkingCopyHelper, {
      state: cerebralTest.getState(),
    });

    await cerebralTest.runSequence(
      'openPrintableTrialSessionWorkingCopyModalSequence',
    );
    await cerebralTest.runSequence(
      'gotoPrintableTrialSessionWorkingCopySequence',
    );

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintableTrialSessionWorkingCopyPreviewPage',
    );

    const methodParams =
      cerebralTest.applicationContext.getUseCases()
        .generatePrintableTrialSessionCopyReportInteractor.mock.calls[0][1];

    expect(
      cerebralTest.applicationContext.getUseCases()
        .generatePrintableTrialSessionCopyReportInteractor.mock.calls.length,
    ).toEqual(1);

    expect(methodParams.formattedCases.length).toEqual(4);
    const [soloCase, leadCase, groupedCase, groupedCaseWithNoLead] =
      methodParams.formattedCases;

    expect(soloCase.isLeadCase).toEqual(false);
    expect(soloCase.inConsolidatedGroup).toEqual(false);
    expect(soloCase.docketNumber).toEqual(createdDocketNumbers[0]);

    expect(leadCase.isLeadCase).toEqual(true);
    expect(leadCase.inConsolidatedGroup).toEqual(true);
    expect(leadCase.docketNumber).toEqual(createdDocketNumbers[1]);

    expect(groupedCase.isLeadCase).toEqual(false);
    expect(groupedCase.inConsolidatedGroup).toEqual(true);
    expect(groupedCase.docketNumber).toEqual(createdDocketNumbers[2]);

    expect(groupedCaseWithNoLead.isLeadCase).toEqual(false);
    expect(groupedCaseWithNoLead.inConsolidatedGroup).toEqual(true);
    expect(groupedCaseWithNoLead.docketNumber).toEqual(createdDocketNumbers[3]);
  });
});
