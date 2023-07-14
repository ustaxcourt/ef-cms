import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setJudgeLastNamesAction } from './setJudgeLastNamesAction';

describe('setJudgeLastNamesAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const secondJudgeUser = { ...judgeUser, name: 'Buch' };
  const mockJudgesInState = [judgeUser, secondJudgeUser];

  it('should set judges on judgeActivityReport filter to the populated list of judges in app state judgeName is "All Judges"', async () => {
    const { state } = await runAction(setJudgeLastNamesAction as any, {
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
        judges: mockJudgesInState,
      },
    });

    expect(state.judgeActivityReport.filters.judges).toEqual([
      judgeUser.name,
      secondJudgeUser.name,
    ]);
  });

  it('should set judgeActivityReport.filters.judges to the selected judge name', async () => {
    const { state } = await runAction(setJudgeLastNamesAction as any, {
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
        judges: mockJudgesInState,
      },
    });

    expect(state.judgeActivityReport.filters.judges).toEqual([judgeUser.name]);
  });
});
