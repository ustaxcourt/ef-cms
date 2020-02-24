import { Case } from '../../shared/src/business/entities/cases/Case';
import {
  fakeFile,
  loginAs,
  setupTest,
  uploadProposedStipulatedDecision,
  viewCaseDetail,
  wait,
} from './helpers';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSetsCaseReadyForTrial from './journey/docketClerkSetsCaseReadyForTrial';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import markAllCasesAsQCed from './journey/markAllCasesAsQCed';
import petitionsClerkBlocksCase from './journey/petitionsClerkBlocksCase';
import petitionsClerkCreatesACaseDeadline from './journey/petitionsClerkCreatesACaseDeadline';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkDeletesCaseDeadline from './journey/petitionsClerkDeletesCaseDeadline';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRemovesPendingItemFromCase from './journey/petitionsClerkRemovesPendingItemFromCase';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkUnblocksCase from './journey/petitionsClerkUnblocksCase';
import petitionsClerkViewsATrialSessionsEligibleCases from './journey/petitionsClerkViewsATrialSessionsEligibleCases';

const test = setupTest();

describe('Blocking a Case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const trialLocation = `Charleston, West Virginia, ${Date.now()}`;
  const overrides = {
    trialLocation,
  };

  petitionsClerkLogIn(test);
  petitionsClerkCreatesNewCase(test, fakeFile, trialLocation);
  petitionsClerkSignsOut(test);

  docketClerkLogIn(test);
  docketClerkSetsCaseReadyForTrial(test);
  docketClerkLogIn(test);
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  docketClerkSignsOut(test);

  petitionsClerkLogIn(test);
  //manual block and unblock - check eligible list
  petitionsClerkViewsATrialSessionsEligibleCases(test, 1);
  petitionsClerkBlocksCase(test, trialLocation);
  petitionsClerkViewsATrialSessionsEligibleCases(test, 0);
  petitionsClerkUnblocksCase(test, trialLocation);
  petitionsClerkViewsATrialSessionsEligibleCases(test, 1);

  //automatic block with a due date
  petitionsClerkCreatesACaseDeadline(test);
  it('petitions clerk views blocked report with an automatically blocked case for due date', async () => {
    // we need to wait for elasticsearch to get updated by the processing stream lambda
    await new Promise(resolve => setTimeout(resolve, 3000));

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.dueDate,
        blocked: false,
        docketNumber: test.docketNumber,
      },
    ]);
  });
  petitionsClerkViewsATrialSessionsEligibleCases(test, 0);
  petitionsClerkDeletesCaseDeadline(test);
  petitionsClerkViewsATrialSessionsEligibleCases(test, 1);
  petitionsClerkSignsOut(test);

  //automatic block with a pending item
  it('respondent uploads a proposed stipulated decision (pending item)', async () => {
    await loginAs(test, 'respondent');
    await viewCaseDetail({
      docketNumber: setupTest.docketNumber,
      test,
    });
    await uploadProposedStipulatedDecision(test);
  });

  petitionsClerkLogIn(test);
  it('petitions clerk views blocked report with an automatically blocked case for pending item', async () => {
    // we need to wait for elasticsearch to get updated by the processing stream lambda
    await new Promise(resolve => setTimeout(resolve, 3000));

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.pending,
        blocked: false,
        docketNumber: test.docketNumber,
      },
    ]);
  });
  petitionsClerkViewsATrialSessionsEligibleCases(test, 0);
  petitionsClerkRemovesPendingItemFromCase(test);
  petitionsClerkViewsATrialSessionsEligibleCases(test, 1);

  //automatic and manual block
  petitionsClerkBlocksCase(test, trialLocation);
  petitionsClerkCreatesACaseDeadline(test);
  it('petitions clerk views blocked report with an automatically and manually blocked case', async () => {
    // we need to wait for elasticsearch to get updated by the processing stream lambda
    await new Promise(resolve => setTimeout(resolve, 4000));

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.dueDate,
        blocked: true,
        blockedReason: 'just because',
        docketNumber: test.docketNumber,
      },
    ]);
  });
  petitionsClerkUnblocksCase(test, trialLocation, false);
  petitionsClerkDeletesCaseDeadline(test);
  petitionsClerkViewsATrialSessionsEligibleCases(test, 1);

  //add deadline for a case that was manually added to a non-calendared session - it shouldn't actually be set to blocked
  it('petitions clerk manually adds case to trial', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openAddToTrialModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: test.trialSessionId,
    });

    await test.runSequence('addCaseToTrialSessionSequence');
    await wait(5000);
  });

  petitionsClerkCreatesACaseDeadline(test);
  it('petitions clerk views blocked report with no blocked cases', async () => {
    // we need to wait for elasticsearch to get updated by the processing stream lambda
    await wait(10000);

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toMatchObject([]);
  });

  markAllCasesAsQCed(test, () => [test.caseId]);
  petitionsClerkSetsATrialSessionsSchedule(test);

  petitionsClerkCreatesACaseDeadline(test);
  it('petitions clerk views blocked report with no blocked cases', async () => {
    // we need to wait for elasticsearch to get updated by the processing stream lambda
    await wait(10000);

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toMatchObject([]);
  });
  petitionsClerkSignsOut(test);
});
