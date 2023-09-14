import { MOCK_CASE } from '@shared/test/mockCase';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseWorksheetsForJudgeAction } from '@web-client/presenter/actions/CaseWorksheet/setCaseWorksheetsForJudgeAction';

describe('setCaseWorksheetsForJudgeAction', () => {
  it('should add the case worksheets to state', async () => {
    const mockCaseWorksheets: RawCaseWorksheet[] = [
      {
        docketNumber: MOCK_CASE.docketNumber,
        entityName: 'CaseWorksheet',
        primaryIssue: 'Superstition ain`t the way',
      },
    ];

    const { state } = await runAction(setCaseWorksheetsForJudgeAction, {
      props: {
        worksheets: mockCaseWorksheets,
      },
      state: {
        submittedAndCavCases: {},
      },
    });

    expect(state.submittedAndCavCases.worksheets).toEqual(mockCaseWorksheets);
  });
});
