import { RawUser } from '@shared/business/entities/User';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setJudgeLastNamesAction } from './setJudgeLastNamesAction';

describe('setJudgeLastNamesAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const allJudges: RawUser[] = [
    {
      ...judgeUser,
      judgeTitle: 'Judge',
      name: 'Some Regular Judge',
    },
    {
      ...judgeUser,
      judgeTitle: 'Chief Judge',
      name: 'Some Chief Judge',
    },
    {
      ...judgeUser,
      judgeTitle: 'Special Trial Judge',
      name: 'Some Special Trial Judge',
    },
    {
      ...judgeUser,
      judgeTitle: 'Chief Special Trial Judge',
      name: 'Some Chief Special Trial Judge',
    },
    {
      ...judgeUser,
      isSeniorJudge: true,
      name: 'Some Senior Judge',
    },
  ];

  it('should set state.judgeActivityReport.filters.judges to current judges populated in state if judgeName is "All Judges"', async () => {
    const { state } = await runAction(setJudgeLastNamesAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeActivityReport: {
          judgeName: 'All Judges',
        },
        judges: allJudges,
      },
    });

    expect(state.judgeActivityReport.filters.judges).toEqual(
      allJudges.map(j => j.name),
    );
  });

  it('should set state.judgeActivityReport.filters.judges to senior judges populated in state if judgeName is "All Senior Judges"', async () => {
    const { state } = await runAction(setJudgeLastNamesAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeActivityReport: {
          judgeName: 'All Senior Judges',
        },
        judges: allJudges,
      },
    });

    expect(state.judgeActivityReport.filters.judges).toEqual([
      'Some Senior Judge',
    ]);
  });

  it('should set state.judgeActivityReport.filters.judges to Special Trial Judges judges populated in state if judgeName is "All Special Trial Judges"', async () => {
    const { state } = await runAction(setJudgeLastNamesAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeActivityReport: {
          judgeName: 'All Special Trial Judges',
        },
        judges: allJudges,
      },
    });

    expect(state.judgeActivityReport.filters.judges).toEqual([
      'Some Special Trial Judge',
      'Some Chief Special Trial Judge',
    ]);
  });

  it('should set state.judgeActivityReport.filters.judges to regular judges populated in state if judgeName is "All Regular Judges"', async () => {
    const { state } = await runAction(setJudgeLastNamesAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeActivityReport: {
          judgeName: 'All Regular Judges',
        },
        judges: allJudges,
      },
    });

    expect(state.judgeActivityReport.filters.judges).toEqual([
      'Some Regular Judge',
      'Some Chief Judge',
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
        judges: allJudges,
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
        judges: allJudges,
      },
    });

    expect(state.judgeActivityReport.judgeNameToDisplayForHeader).toBe(
      judgeUser.name,
    );
  });
});
