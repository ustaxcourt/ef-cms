import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setJudgeActivityReportDataAction } from './setJudgeActivityReportDataAction';

describe('setJudgeActivityReportDataAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockCasesClosedByJudge = {
    [CASE_STATUS_TYPES.closed]: 4,
    [CASE_STATUS_TYPES.closedDismissed]: 8,
  };

  const mockTrialSessions = {
    [SESSION_TYPES.hybrid]: 0.5,
    [SESSION_TYPES.regular]: 1.5,
    [SESSION_TYPES.motionHearing]: 2,
  };

  const baseState = {
    judgeActivityReport: {
      filters: { judgeName: judgeUser.name },
      judgeActivityReportData: {},
    },
  };

  it('should set props.casesClosedByJudge on state.judgeActivityReport', async () => {
    const { state } = await runAction(setJudgeActivityReportDataAction, {
      modules: {
        presenter,
      },
      props: {
        casesClosedByJudge: mockCasesClosedByJudge,
      },
      state: baseState,
    });

    expect(
      state.judgeActivityReport.judgeActivityReportData.casesClosedByJudge,
    ).toBe(mockCasesClosedByJudge);
  });

  it('should set props.trialSessions on state.judgeActivityReport', async () => {
    const { state } = await runAction(setJudgeActivityReportDataAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessions: mockTrialSessions,
      },
      state: baseState,
    });

    expect(
      state.judgeActivityReport.judgeActivityReportData.trialSessions,
    ).toBe(mockTrialSessions);
  });
});
