import { InvalidEntityError, UnauthorizedError } from '@web-api/errors/errors';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  colvinsChambersUser,
  judgeColvin,
  petitionsClerkUser,
} from '@shared/test/mockUsers';
import { updateCaseWorksheetInteractor } from './updateCaseWorksheetInteractor';

describe('updateCaseWorksheetInteractor', () => {
  const mockCaseWorksheet: RawCaseWorksheet = {
    docketNumber: '101-23',
    entityName: 'CaseWorksheet',
    primaryIssue: 'Don`t go chasin waterfalls',
  };

  beforeAll(() => {
    applicationContext
      .getUseCaseHelpers()
      .getJudgeForUserHelper.mockReturnValue(judgeColvin);
  });

  it('should throw an error when the user does not have access to the case worksheet feature', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser); // Only judges and judges chambers have access to case worksheets

    await expect(
      updateCaseWorksheetInteractor(applicationContext, {
        worksheet: mockCaseWorksheet,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the updated case worksheet is invalid', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeColvin);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(judgeColvin);

    await expect(
      updateCaseWorksheetInteractor(applicationContext, {
        worksheet: {
          ...mockCaseWorksheet,
          finalBriefDueDate: 'abc', // finalBriefDueDate should be a date formatted as YYYY-MM-DD
        },
      }),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should persist and return the updated case worksheet when the updates are valid', async () => {
    const mockFinalBriefDueDate = '2023-08-29';
    applicationContext.getCurrentUser.mockReturnValue(judgeColvin);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(judgeColvin);
    applicationContext
      .getPersistenceGateway()
      .getCaseWorksheet.mockResolvedValue(mockCaseWorksheet);

    const result = await updateCaseWorksheetInteractor(applicationContext, {
      worksheet: {
        ...mockCaseWorksheet,
        finalBriefDueDate: mockFinalBriefDueDate,
      },
    });

    const expectedUpdatedCaseWorksheet = {
      ...mockCaseWorksheet,
      finalBriefDueDate: mockFinalBriefDueDate,
    };
    expect(
      applicationContext.getUseCaseHelpers().getJudgeInSectionHelper,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCaseWorksheet,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseWorksheet: expectedUpdatedCaseWorksheet,
      judgeUserId: judgeColvin.userId,
    });
    expect(result).toEqual(expectedUpdatedCaseWorksheet);
  });

  it('should persist the updated case worksheet when the updates are valid, using the judge`s userId in the section when the current user is a chambers user', async () => {
    const mockFinalBriefDueDate = '2023-08-29';
    applicationContext.getCurrentUser.mockReturnValue(colvinsChambersUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseWorksheet.mockResolvedValue(mockCaseWorksheet);

    const result = await updateCaseWorksheetInteractor(applicationContext, {
      worksheet: {
        ...mockCaseWorksheet,
        finalBriefDueDate: mockFinalBriefDueDate,
      },
    });

    const expectedUpdatedCaseWorksheet = {
      ...mockCaseWorksheet,
      finalBriefDueDate: mockFinalBriefDueDate,
    };
    expect(
      applicationContext.getUseCaseHelpers().getJudgeForUserHelper.mock
        .calls[0][1],
    ).toEqual({
      user: colvinsChambersUser,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCaseWorksheet,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseWorksheet: expectedUpdatedCaseWorksheet,
      judgeUserId: judgeColvin.userId,
    });
    expect(result).toEqual(expectedUpdatedCaseWorksheet);
  });
});
