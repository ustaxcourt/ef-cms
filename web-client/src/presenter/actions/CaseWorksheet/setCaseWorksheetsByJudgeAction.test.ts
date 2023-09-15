import { MOCK_CASE } from '@shared/test/mockCase';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseWorksheetsByJudgeAction } from '@web-client/presenter/actions/CaseWorksheet/setCaseWorksheetsByJudgeAction';

describe('setCaseWorksheetsByJudgeAction', () => {
  it('should add the case worksheets to state', async () => {
    const mockCaseWorksheets: RawCaseWorksheet[] = [
      {
        docketNumber: MOCK_CASE.docketNumber,
        entityName: 'CaseWorksheet',
        primaryIssue: 'Superstition ain`t the way',
      },
    ];

    const { state } = await runAction(setCaseWorksheetsByJudgeAction, {
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
