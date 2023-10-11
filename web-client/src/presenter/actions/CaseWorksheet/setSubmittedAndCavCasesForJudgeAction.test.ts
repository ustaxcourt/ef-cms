import { MOCK_SUBMITTED_CASE } from '@shared/test/mockCase';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSubmittedAndCavCasesForJudgeAction } from './setSubmittedAndCavCasesForJudgeAction';

describe('setSubmittedAndCavCasesForJudgeAction', () => {
  it('should set cases from props onto state.submittedAndCavCases.submittedAndCavCasesByJudge', async () => {
    const mockSubmittedAndCavCasesByJudge: (RawCase & {
      daysElapsedSinceLastStatusChange: number;
      formattedCaseCount: number;
    })[] = [
      {
        ...MOCK_SUBMITTED_CASE,
        daysElapsedSinceLastStatusChange: 4,
        formattedCaseCount: 1,
      },
    ];
    const { state } = await runAction(setSubmittedAndCavCasesForJudgeAction, {
      props: {
        cases: mockSubmittedAndCavCasesByJudge,
      },
      state: {
        submittedAndCavCases: {
          submittedAndCavCasesByJudge: undefined,
        },
      },
    });

    expect(state.submittedAndCavCases.submittedAndCavCasesByJudge).toEqual(
      mockSubmittedAndCavCasesByJudge,
    );
  });
});
