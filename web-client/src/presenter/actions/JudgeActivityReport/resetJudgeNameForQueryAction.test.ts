import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { resetJudgeNameForQueryAction } from './resetJudgeNameForQueryAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetJudgeNameForQueryAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should reset judgeName on state if judge name is "All Judges"', async () => {
    const { state } = await runAction(resetJudgeNameForQueryAction as any, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeActivityReport: {
          filters: {
            judgeName: 'All Judges',
          },
        },
      },
    });

    expect(state.judgeActivityReport.filters.judgeName).toEqual('');
  });

  it('should not reset judgeName on state if judge name is a valid judge name', async () => {
    const { state } = await runAction(resetJudgeNameForQueryAction as any, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeActivityReport: {
          filters: {
            judgeName: judgeUser.name,
          },
        },
      },
    });

    expect(state.judgeActivityReport.filters.judgeName).toBe(judgeUser.name);
  });
});
