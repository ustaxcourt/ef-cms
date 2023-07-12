import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  chambersUser,
  judgeUser,
} from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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

    expect(state.form.judgeName).toBe(judgeUser.name);
  });

  it('should set state.form.judgeName to the last name of the judge of the chambers when the current user is a chambers user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(chambersUser);

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

    expect(state.form.judgeName).toBe('Colvin');
  });
});
