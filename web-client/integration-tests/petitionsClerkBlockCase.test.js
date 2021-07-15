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

const cerebralTest = setupTest();

describe('Blocking a Case', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const trialLocation = `Charleston, West Virginia, ${Date.now()}`;
  const overrides = {
    trialLocation,
  };

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile, trialLocation);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides);
  docketClerkViewsTrialSessionList(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  //manual block and unblock - check eligible list
  petitionsClerkViewsATrialSessionsEligibleCases(cerebralTest, 1);
  petitionsClerkBlocksCase(cerebralTest, trialLocation);
  petitionsClerkViewsATrialSessionsEligibleCases(cerebralTest, 0);
  petitionsClerkUnblocksCase(cerebralTest, trialLocation);
  petitionsClerkViewsATrialSessionsEligibleCases(cerebralTest, 1);

  // automatic block with a due date
  petitionsClerkCreatesACaseDeadline(cerebralTest);

  it('petitions clerk views blocked report with an automatically blocked case for due date', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoBlockedCasesReportSequence');

    await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(cerebralTest.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
        blocked: false,
        docketNumber: cerebralTest.docketNumber,
      },
    ]);
  });

  petitionsClerkRemovesPendingItemFromCase(cerebralTest);
  petitionsClerkViewsATrialSessionsEligibleCases(cerebralTest, 0);
  petitionsClerkDeletesCaseDeadline(cerebralTest);
  petitionsClerkViewsATrialSessionsEligibleCases(cerebralTest, 1);

  //automatic block with a pending item
  loginAs(cerebralTest, 'irsPractitioner@example.com');

  it('respondent uploads a proposed stipulated decision (pending item)', async () => {
    await viewCaseDetail({
      cerebralTest,
      docketNumber: setupTest.docketNumber,
    });
    await uploadProposedStipulatedDecision(cerebralTest);
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('petitions clerk views blocked report with an automatically blocked case for pending item', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoBlockedCasesReportSequence');

    await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(cerebralTest.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
        blocked: false,
        docketNumber: cerebralTest.docketNumber,
      },
    ]);
  });
  petitionsClerkViewsATrialSessionsEligibleCases(cerebralTest, 0);
  petitionsClerkRemovesPendingItemFromCase(cerebralTest);
  petitionsClerkViewsATrialSessionsEligibleCases(cerebralTest, 1);

  //automatic and manual block
  petitionsClerkBlocksCase(cerebralTest, trialLocation);
  petitionsClerkCreatesACaseDeadline(cerebralTest);
  it('petitions clerk views blocked report with an automatically and manually blocked case', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoBlockedCasesReportSequence');

    await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(cerebralTest.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
        blocked: true,
        blockedReason: 'just because',
        docketNumber: cerebralTest.docketNumber,
      },
    ]);
  });
  petitionsClerkUnblocksCase(cerebralTest, trialLocation, false);
  petitionsClerkDeletesCaseDeadline(cerebralTest);
  petitionsClerkViewsATrialSessionsEligibleCases(cerebralTest, 1);

  //add deadline for a case that was manually added to a non-calendared session - it shouldn't actually be set to blocked
  it('petitions clerk manually adds case to trial', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openAddToTrialModalSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('addCaseToTrialSessionSequence');
    await refreshElasticsearchIndex();
  });

  petitionsClerkCreatesACaseDeadline(cerebralTest);
  it('petitions clerk views blocked report with no blocked cases', async () => {
    await cerebralTest.runSequence('gotoBlockedCasesReportSequence');

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(cerebralTest.getState('blockedCases')).toMatchObject([]);
  });

  markAllCasesAsQCed(cerebralTest, () => [cerebralTest.docketNumber]);
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  petitionsClerkCreatesACaseDeadline(cerebralTest);
  it('petitions clerk views blocked report with no blocked cases', async () => {
    await cerebralTest.runSequence('gotoBlockedCasesReportSequence');

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(cerebralTest.getState('blockedCases')).toMatchObject([]);
  });
});
