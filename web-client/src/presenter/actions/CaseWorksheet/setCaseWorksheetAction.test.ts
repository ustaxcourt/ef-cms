import { MOCK_CASE } from '@shared/test/mockCase';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseWorksheetAction } from './setCaseWorksheetAction';

describe('setUpdatedCaseInStateAction', () => {
  const mockCaseWorksheet: RawCaseWorksheet = {
    docketNumber: MOCK_CASE.docketNumber,
    entityName: 'CaseWorksheet',
    primaryIssue: 'Superstition ain`t the way',
  };

  it('should add the updated worksheet to the list of worksheets in state when it does not already exist in the list', async () => {
    const { state } = await runAction(setCaseWorksheetAction, {
      props: {
        updatedWorksheet: mockCaseWorksheet,
      },
      state: {
        submittedAndCavCases: {
          worksheets: [],
        },
      },
    });

    expect(state.submittedAndCavCases.worksheets).toEqual([mockCaseWorksheet]);
  });

  it('should update the existing in state when it already exists in the list', async () => {
    const mockCaseWorksheet2: RawCaseWorksheet = {
      docketNumber: '102-18',
      entityName: 'CaseWorksheet',
      finalBriefDueDate: '2023-08-29',
    };

    const { state } = await runAction(setCaseWorksheetAction, {
      props: {
        updatedWorksheet: mockCaseWorksheet,
      },
      state: {
        submittedAndCavCases: {
          worksheets: [
            mockCaseWorksheet2,
            {
              ...mockCaseWorksheet,
              primaryIssue:
                'When you believe in things that you don`t understand',
            },
          ],
        },
      },
    });

    expect(state.submittedAndCavCases.worksheets).toEqual([
      mockCaseWorksheet2,
      mockCaseWorksheet,
    ]);
  });
});
