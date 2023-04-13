import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setJudgeLastNameOnFormAction } from './setJudgeLastNameOnFormAction';

describe('setJudgeLastNameOnFormAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set state.form.judgeName to the last name of the current user when they are a judge', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
    const { state } = await runAction(setJudgeLastNameOnFormAction, {
      modules: {
        presenter,
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

  it('should set state.form.judgeName to the last name of the judge of the chambers when the current user is a chambers user', async () => {
    const { state } = await runAction(setJudgeLastNameOnFormAction, {
      modules: {
        presenter,
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
});
