import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setJudgeLastNamesAction } from './setJudgeLastNamesAction';

describe('setJudgeLastNamesAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const secondJudgeUser = { ...judgeUser, name: 'Buch' };
  const mockJudgesInState = [judgeUser, secondJudgeUser];

  it('should set state.judgeActivityReport.filters.judges to current judges populated in state if judgeName is "All Judges"', async () => {
    const { state } = await runAction(setJudgeLastNamesAction as any, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeActivityReport: {
          judgeName: 'All Judges',
        },
        judges: mockJudgesInState,
      },
    });

    expect(state.judgeActivityReport.filters.judges).toEqual([
      judgeUser.name,
      secondJudgeUser.name,
    ]);
  });

  it('should set judgeActivityReport.filters.judges to the selected judge name', async () => {
    const { state } = await runAction(setJudgeLastNamesAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeActivityReport: {
          judgeName: judgeUser.name,
        },
        judges: mockJudgesInState,
      },
    });

    expect(state.judgeActivityReport.filters.judges).toEqual([judgeUser.name]);
  });

  it('should set state.judgeActivityReport.judgeNameToDisplayForHeader to the selected judge', async () => {
    const { state } = await runAction(setJudgeLastNamesAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeActivityReport: {
          judgeName: judgeUser.name,
        },
        judges: mockJudgesInState,
      },
    });

    expect(state.judgeActivityReport.judgeNameToDisplayForHeader).toBe(
      judgeUser.name,
    );
  });
});
