import { AUTOMATIC_BLOCKED_REASONS } from '../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession.js';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList.js';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';
import axios from 'axios';

const test = setupTest();

const axiosInstance = axios.create({
  headers: {
    Authorization:
      // mocked admin user
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwibmFtZSI6IlRlc3QgQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJ1c2VySWQiOiI4NmMzZjg3Yi0zNTBiLTQ3N2QtOTJjMy00M2JkMDk1Y2IwMDYiLCJjdXN0b206cm9sZSI6ImFkbWluIiwic3ViIjoiODZjM2Y4N2ItMzUwYi00NzdkLTkyYzMtNDNiZDA5NWNiMDA2IiwiaWF0IjoxNTgyOTIxMTI1fQ.PBmSyb6_E_53FNG0GiEpAFqTNmooSh4rI0ApUQt3UH8',
    'Content-Type': 'application/json',
  },
  timeout: 2000,
});

const { CHIEF_JUDGE, STATUS_TYPES } = applicationContext.getConstants();

const DOCKET_NUMBER_UNBLOCKED = '150-12';
const DOCKET_NUMBER_BLOCKED = '151-12';
const DOCKET_NUMBER_DEADLINE = '152-12';
const TRIAL_CITY = `Washington, District of Columbia, ${Date.now()}`;

const legacyCaseReadyForTrial = {
  ...MOCK_CASE,
  associatedJudge: CHIEF_JUDGE,
  caseCaption: 'Case is ready for trial',
  docketNumber: DOCKET_NUMBER_UNBLOCKED,
  preferredTrialCity: TRIAL_CITY,
  status: STATUS_TYPES.generalDocketReadyForTrial,
};

const legacyCaseReadyForTrialAndBlocked = {
  ...MOCK_CASE,
  associatedJudge: CHIEF_JUDGE,
  blocked: true,
  blockedDate: '2019-08-08T14:33:24.183Z',
  blockedReason: 'legacy blocked',
  caseCaption: 'Case is ready for trial and blocked',
  docketNumber: DOCKET_NUMBER_BLOCKED,
  preferredTrialCity: TRIAL_CITY,
  status: STATUS_TYPES.generalDocketReadyForTrial,
};

const legacyCaseReadyForTrialWithDeadline = {
  ...MOCK_CASE,
  associatedJudge: CHIEF_JUDGE,
  automaticBlocked: true, // the migration team sends cases with due dates as automaticBlocked
  automaticBlockedDate: '2019-08-08T14:33:24.183Z',
  automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
  caseCaption: 'Case is ready for trial with deadline',
  docketNumber: DOCKET_NUMBER_DEADLINE,
  preferredTrialCity: TRIAL_CITY,
  status: STATUS_TYPES.generalDocketReadyForTrial,
};

const legacyDeadline = {
  associatedJudge: CHIEF_JUDGE,
  caseDeadlineId: 'e7aeadd8-b0d0-4826-af31-22c0d8c6c173',
  createdAt: '2020-01-01T01:02:15.185-04:00',
  deadlineDate: '2020-01-24T00:00:00.000-05:00',
  description: 'Due date migrated from Blackstone',
  docketNumber: DOCKET_NUMBER_DEADLINE,
  entityName: 'CaseDeadline',
};

describe('Migrate legacy cases that are ready for trial', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  it('should migrate legacy cases that are ready for trial', async () => {
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      legacyCaseReadyForTrial,
    );
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      legacyCaseReadyForTrialAndBlocked,
    );
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      legacyCaseReadyForTrialWithDeadline,
    );

    await axiosInstance.post(
      'http://localhost:4000/migrate/case-deadline',
      legacyDeadline,
    );

    await refreshElasticsearchIndex();
  });

  const options = {
    maxCases: 100,
    preferredTrialCity: TRIAL_CITY,
    sessionType: 'Hybrid',
    trialLocation: TRIAL_CITY,
  };

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, options);
  docketClerkViewsTrialSessionList(test, options);

  it('docket clerk should see migrated case as eligible for trial on session', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    expect(test.getState('trialSession.eligibleCases').length).toEqual(1);
    expect(test.getState('trialSession.eligibleCases')[0].docketNumber).toEqual(
      legacyCaseReadyForTrial.docketNumber,
    );
  });
});
