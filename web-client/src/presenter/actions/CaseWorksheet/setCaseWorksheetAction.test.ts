import { MOCK_CASE } from '@shared/test/mockCase';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { judgeColvin } from '@shared/test/mockUsers';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseWorksheetAction } from './setCaseWorksheetAction';

describe('setUpdatedCaseInStateAction', () => {
  const mockCaseWorksheet: RawCaseWorksheet = {
    docketNumber: MOCK_CASE.docketNumber,
    entityName: 'CaseWorksheet',
    judgeUserId: judgeColvin.userId,
    primaryIssue: 'Superstition ain`t the way',
  };

  it('should add the updated worksheet to the case in state', async () => {
    const { state } = await runAction(setCaseWorksheetAction, {
      props: {
        updatedWorksheet: mockCaseWorksheet,
      },
      state: {
        submittedAndCavCases: {
          submittedAndCavCasesByJudge: [
            { docketNumber: MOCK_CASE.docketNumber },
          ],
        },
      },
    });

    expect(state.submittedAndCavCases.submittedAndCavCasesByJudge).toEqual([
      {
        caseWorksheet: mockCaseWorksheet,
        docketNumber: MOCK_CASE.docketNumber,
      },
    ]);
  });
});
