import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  chambersUser,
  judgeUser,
} from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setJudgeLastNameOnJudgeActivityReportAction } from './setJudgeLastNameOnJudgeActivityReportAction';

describe('setJudgeLastNameOnJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set state.judgeActivityReport.filters.judgeName (and judgeNameToDisplayForHeader) to the last name of the current user when they are a judge', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    const { state } = await runAction(
      setJudgeLastNameOnJudgeActivityReportAction,
      {
        modules: {
          presenter,
        },
      },
    );

    expect(state.judgeActivityReport.filters.judgeName).toBe(judgeUser.name);
    expect(state.judgeActivityReport.filters.judgeNameToDisplayForHeader).toBe(
      judgeUser.name,
    );
  });

  it('should set state.judgeActivityReport.filters.judgeName (and judgeNameToDisplayForHeader) to the last name of the judge of the chambers when the current user is a chambers user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(chambersUser);

    const { state } = await runAction(
      setJudgeLastNameOnJudgeActivityReportAction,
      {
        modules: {
          presenter,
        },
      },
    );

    expect(state.judgeActivityReport.filters.judgeNameToDisplayForHeader).toBe(
      'Colvin',
    );
    expect(state.judgeActivityReport.filters.judgeName).toBe('Colvin');
  });
});
