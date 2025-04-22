import '@web-api/persistence/postgres/caseWorksheets/mocks.jest';
import { InvalidEntityError, UnauthorizedError } from '@web-api/errors/errors';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseWorksheetsByDocketNumber as getCaseWorksheetsByDocketNumberMock } from '@web-api/persistence/postgres/caseWorksheets/getCaseWorksheetsByDocketNumber';
import { judgeColvin } from '@shared/test/mockUsers';
import {
  mockChambersUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { updateCaseWorksheetInteractor } from './updateCaseWorksheetInteractor';
import { upsertCaseWorksheets as upsertCaseWorksheetsMock } from '@web-api/persistence/postgres/caseWorksheets/upsertCaseWorksheets';

const getCaseWorksheetsByDocketNumber =
  getCaseWorksheetsByDocketNumberMock as jest.Mock;
const upsertCaseWorksheets = upsertCaseWorksheetsMock as jest.Mock;

describe('updateCaseWorksheetInteractor', () => {
  const mockCaseWorksheet: RawCaseWorksheet = {
    docketNumber: '101-23',
    entityName: 'CaseWorksheet',
    judgeUserId: judgeColvin.userId,
    primaryIssue: 'Don`t go chasin waterfalls',
  };

  it('should throw an error when the user does not have access to the case worksheet feature', async () => {
    await expect(
      updateCaseWorksheetInteractor(
        {
          worksheet: mockCaseWorksheet,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the updated case worksheet is invalid', async () => {
    await expect(
      updateCaseWorksheetInteractor(
        {
          worksheet: {
            ...mockCaseWorksheet,
            finalBriefDueDate: 'abc', // finalBriefDueDate should be a date formatted as YYYY-MM-DD
          },
        },
        judgeColvin as UnknownAuthUser,
      ),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should persist and return the updated case worksheet when the updates are valid', async () => {
    const mockFinalBriefDueDate = '2023-08-29';
    getCaseWorksheetsByDocketNumber.mockResolvedValue([mockCaseWorksheet]);

    const result = await updateCaseWorksheetInteractor(
      {
        worksheet: {
          ...mockCaseWorksheet,
          finalBriefDueDate: mockFinalBriefDueDate,
        },
      },
      judgeColvin as UnknownAuthUser,
    );

    const expectedUpdatedCaseWorksheet = {
      ...mockCaseWorksheet,
      finalBriefDueDate: mockFinalBriefDueDate,
    };
    expect(upsertCaseWorksheets).toHaveBeenCalledWith([
      expectedUpdatedCaseWorksheet,
    ]);
    expect(result).toEqual(expectedUpdatedCaseWorksheet);
  });

  it('should persist the updated case worksheet when the updates are valid, using the judge`s userId in the section when the current user is a chambers user', async () => {
    const mockFinalBriefDueDate = '2023-08-29';
    getCaseWorksheetsByDocketNumber.mockResolvedValue([mockCaseWorksheet]);

    const result = await updateCaseWorksheetInteractor(
      {
        worksheet: {
          ...mockCaseWorksheet,
          finalBriefDueDate: mockFinalBriefDueDate,
        },
      },
      mockChambersUser,
    );

    const expectedUpdatedCaseWorksheet = {
      ...mockCaseWorksheet,
      finalBriefDueDate: mockFinalBriefDueDate,
    };
    expect(upsertCaseWorksheets).toHaveBeenCalledWith([
      expectedUpdatedCaseWorksheet,
    ]);
    expect(result).toEqual(expectedUpdatedCaseWorksheet);
  });
});
