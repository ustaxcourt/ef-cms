import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setJudgeActivityReportDataAction } from './setJudgeActivityReportDataAction';

describe('setJudgeActivityReportDataAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set props.casesClosedByJudge on state', async () => {
    const mockCasesClosedByJudge = {
      [CASE_STATUS_TYPES.closed]: 1,
      [CASE_STATUS_TYPES.closedDismissed]: 3,
    };

    const { state } = await runAction(setJudgeActivityReportDataAction, {
      modules: {
        presenter,
      },
      props: {
        casesClosedByJudge: mockCasesClosedByJudge,
      },
      state: {
        judgeActivityReportData: {
          casesClosedByJudge: undefined,
        },
      },
    });

    expect(state.judgeActivityReportData.casesClosedByJudge).toBe(
      mockCasesClosedByJudge,
    );
  });

  it('should set props.trialSessions on state', async () => {
    const mockTrialSessions = {
      [SESSION_TYPES.hybrid]: 0.5,
      [SESSION_TYPES.regular]: 1.5,
      [SESSION_TYPES.motionHearing]: 2,
    };

    const { state } = await runAction(setJudgeActivityReportDataAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessions: mockTrialSessions,
      },
      state: {
        judgeActivityReportData: {
          trialSessions: undefined,
        },
      },
    });

    expect(state.judgeActivityReportData.trialSessions).toBe(mockTrialSessions);
  });
});
