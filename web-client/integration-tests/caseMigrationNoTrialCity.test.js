import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';
import axios from 'axios';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

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

const { STATUS_TYPES } = applicationContext.getConstants();

const theCase = {
  ...MOCK_CASE,
  automaticBlocked: true,
  automaticBlockedDate: '2019-08-25T05:00:00.000Z',
  automaticBlockedReason: 'Due Date',
  docketEntries: [],
  docketNumber: '1338-20',
  preferredTrialCity: null,
  status: STATUS_TYPES.generalDocketReadyForTrial,
};

const caseDeadline = {
  associatedJudge: 'Buch',
  caseDeadlineId: 'ad1ddb24-f3c4-47b4-b10e-76d1d050b2ab',
  createdAt: '2020-01-01T01:02:15.185-04:00',
  deadlineDate: '2020-01-24T00:00:00.000-05:00',
  description: 'Due date migrated from Blackstone',
  docketNumber: theCase.docketNumber,
  entityName: 'CaseDeadline',
};

describe('migrate a case that is missing a preferred trial city journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  it('migrate the case and deadline', async () => {
    await axiosInstance.post('http://localhost:4000/migrate/case', theCase);
    await axiosInstance.post(
      'http://localhost:4000/migrate/case-deadline',
      caseDeadline,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(test, 'docketclerk@example.com');

  it('verify the case is blocked because it has a deadline', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: theCase.docketNumber,
    });

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formattedCase.showBlockedFromTrial).toBeTruthy();
  });

  it('remove the deadline and verify the case is no longer blocked', async () => {
    test.setState(
      'form.caseDeadlineId',
      'ad1ddb24-f3c4-47b4-b10e-76d1d050b2ab',
    );

    await test.runSequence('deleteCaseDeadlineSequence', {
      docketNumber: theCase.docketNumber,
    });

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formattedCase.showBlockedFromTrial).toBeFalsy();
  });
});
