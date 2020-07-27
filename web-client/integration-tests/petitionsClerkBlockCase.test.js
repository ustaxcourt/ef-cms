import { AUTOMATIC_BLOCKED_REASONS } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadProposedStipulatedDecision,
  viewCaseDetail,
} from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkBlocksCase } from './journey/petitionsClerkBlocksCase';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkDeletesCaseDeadline } from './journey/petitionsClerkDeletesCaseDeadline';
import { petitionsClerkRemovesPendingItemFromCase } from './journey/petitionsClerkRemovesPendingItemFromCase';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkUnblocksCase } from './journey/petitionsClerkUnblocksCase';
import { petitionsClerkViewsATrialSessionsEligibleCases } from './journey/petitionsClerkViewsATrialSessionsEligibleCases';

const test = setupTest();

describe('Blocking a Case', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const trialLocation = `Charleston, West Virginia, ${Date.now()}`;
  const overrides = {
    trialLocation,
  };

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile, trialLocation);

  loginAs(test, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(test);
  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);

  loginAs(test, 'petitionsclerk@example.com');
  //manual block and unblock - check eligible list
  petitionsClerkViewsATrialSessionsEligibleCases(test, 1);
  petitionsClerkBlocksCase(test, trialLocation);
  petitionsClerkViewsATrialSessionsEligibleCases(test, 0);
  petitionsClerkUnblocksCase(test, trialLocation);
  petitionsClerkViewsATrialSessionsEligibleCases(test, 1);

  // //automatic block with a due date
  petitionsClerkCreatesACaseDeadline(test);
  it('petitions clerk views blocked report with an automatically blocked case for due date', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
        blocked: false,
        docketNumber: test.docketNumber,
      },
    ]);
  });
  petitionsClerkViewsATrialSessionsEligibleCases(test, 0);
  petitionsClerkDeletesCaseDeadline(test);
  petitionsClerkViewsATrialSessionsEligibleCases(test, 1);

  //automatic block with a pending item
  loginAs(test, 'irsPractitioner@example.com');

  it('respondent uploads a proposed stipulated decision (pending item)', async () => {
    await viewCaseDetail({
      docketNumber: setupTest.docketNumber,
      test,
    });
    await uploadProposedStipulatedDecision(test);
  });

  loginAs(test, 'petitionsclerk@example.com');
  it('petitions clerk views blocked report with an automatically blocked case for pending item', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
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
    await refreshElasticsearchIndex();

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
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
    await refreshElasticsearchIndex();
  });

  petitionsClerkCreatesACaseDeadline(test);
  it('petitions clerk views blocked report with no blocked cases', async () => {
    await test.runSequence('gotoBlockedCasesReportSequence');

    await refreshElasticsearchIndex();

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toMatchObject([]);
  });

  markAllCasesAsQCed(test, () => [test.docketNumber]);
  petitionsClerkSetsATrialSessionsSchedule(test);

  petitionsClerkCreatesACaseDeadline(test);
  it('petitions clerk views blocked report with no blocked cases', async () => {
    await test.runSequence('gotoBlockedCasesReportSequence');

    await refreshElasticsearchIndex();

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toMatchObject([]);
  });
});
