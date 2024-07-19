import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPendingMotionDocketEntriesAction } from '@web-client/presenter/actions/PendingMotion/getPendingMotionDocketEntriesAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
describe('getPendingMotionDocketEntriesAction', () => {
  const FILTER_ALL_JUDGES = 'All Judges';
  const FILTER_ALL_SENIOR_JUDGES = 'All Senior Judges';
  const FILTER_ALL_SPECIAL_TRIAL_JUDGES = 'All Special Trial Judges';
  const FILTER_ALL_REGULAR_JUDGES = 'All Regular Judges';
  const JUDGE_A = 'Judge A';
  const JUDGE_B = 'Judge B';
  const JUDGE_C = 'Judge C';

  const mockJudges = [
    { isSeniorJudge: false, judgeTitle: 'Judge', name: JUDGE_A, userId: '1' },
    {
      isSeniorJudge: true,
      judgeTitle: 'Senior Judge',
      name: JUDGE_B,
      userId: '2',
    },
    {
      isSeniorJudge: false,
      judgeTitle: 'Special Trial Judge',
      name: JUDGE_C,
      userId: '3',
    },
  ];

  const mockDocketEntries = [
    { docketEntryId: '1', status: 'pending' },
    { docketEntryId: '2', status: 'pending' },
  ];

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getPendingMotionDocketEntriesForCurrentJudgeInteractor.mockResolvedValue(
        {
          docketEntries: mockDocketEntries,
        },
      );
  });

  it(`should return all judges when filter is "${FILTER_ALL_JUDGES}"`, async () => {
    const { state } = await runAction(getPendingMotionDocketEntriesAction, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            judgeName: FILTER_ALL_JUDGES,
          },
        },
        judges: mockJudges,
      },
    });

    expect(state.judgeActivityReport.filters.judgeName).toEqual(
      FILTER_ALL_JUDGES,
    );
    expect(state.judges).toEqual(mockJudges);
  });

  it(`should return only senior judges when filter is "${FILTER_ALL_SENIOR_JUDGES}"`, async () => {
    const { state } = await runAction(getPendingMotionDocketEntriesAction, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            judgeName: FILTER_ALL_SENIOR_JUDGES,
          },
        },
        judges: mockJudges,
      },
    });

    expect(state.judgeActivityReport.filters.judgeName).toEqual(
      FILTER_ALL_SENIOR_JUDGES,
    );
    expect(state.judges.filter(judge => judge.isSeniorJudge)).toEqual([
      mockJudges[1],
    ]);
  });

  it(`should return only special trial judges when filter is "${FILTER_ALL_SPECIAL_TRIAL_JUDGES}"`, async () => {
    const { state } = await runAction(getPendingMotionDocketEntriesAction, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            judgeName: FILTER_ALL_SPECIAL_TRIAL_JUDGES,
          },
        },
        judges: mockJudges,
      },
    });

    expect(state.judgeActivityReport.filters.judgeName).toEqual(
      FILTER_ALL_SPECIAL_TRIAL_JUDGES,
    );
    expect(
      state.judges.filter(judge =>
        judge.judgeTitle!.includes('Special Trial Judge'),
      ),
    ).toEqual([mockJudges[2]]);
  });

  it(`should return only regular judges when filter is "${FILTER_ALL_REGULAR_JUDGES}"`, async () => {
    const { state } = await runAction(getPendingMotionDocketEntriesAction, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            judgeName: FILTER_ALL_REGULAR_JUDGES,
          },
        },
        judges: mockJudges,
      },
    });

    expect(state.judgeActivityReport.filters.judgeName).toEqual(
      FILTER_ALL_REGULAR_JUDGES,
    );
    expect(
      state.judges.filter(
        judge =>
          !judge.isSeniorJudge &&
          (judge.judgeTitle === 'Judge' || judge.judgeTitle === 'Chief Judge'),
      ),
    ).toEqual([mockJudges[0]]);
  });

  it('should return specific judge when filter matches a judge name', async () => {
    const { state } = await runAction(getPendingMotionDocketEntriesAction, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            judgeName: JUDGE_A,
          },
        },
        judges: mockJudges,
      },
    });

    expect(state.judgeActivityReport.filters.judgeName).toEqual(JUDGE_A);
    expect(state.judges.find(judge => judge.name === JUDGE_A)).toEqual(
      mockJudges[0],
    );
  });
});
