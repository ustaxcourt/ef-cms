import { InvalidEntityError, UnauthorizedError } from '../../../errors/errors';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { applicationContext } from '../../test/createTestApplicationContext';
import { judgeUser, petitionsClerkUser } from '@shared/test/mockUsers';
import { updateCaseWorksheetInteractor } from './updateCaseWorksheetInteractor';

describe('updateCaseWorksheetInteractor', () => {
  const mockCaseWorksheet: RawCaseWorksheet = {
    docketNumber: '101-23',
    entityName: 'CaseWorksheet',
    primaryIssue: 'Don`t go chasin waterfalls',
  };

  it('should throw an error when the user does not have access to the case worksheet feature', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser); // Only judges and judges chambers have access to case worksheets

    await expect(
      updateCaseWorksheetInteractor(applicationContext, {
        docketNumber: mockCaseWorksheet.docketNumber,
        updatedProps: {},
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the updated case worksheet is invalid', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    await expect(
      updateCaseWorksheetInteractor(applicationContext, {
        docketNumber: mockCaseWorksheet.docketNumber,
        updatedProps: {
          finalBriefDueDate: 'abc', // finalBriefDueDate should be a date formatted as YYYY-MM-DD
        },
      }),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should persist and return the updated case worksheet when the updates are valid', async () => {
    const mockFinalBriefDueDate = '2023-08-29';
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseWorksheet.mockResolvedValue(mockCaseWorksheet);

    const result = await updateCaseWorksheetInteractor(applicationContext, {
      docketNumber: mockCaseWorksheet.docketNumber,
      updatedProps: {
        finalBriefDueDate: mockFinalBriefDueDate,
      },
    });

    const expectedUpdatedCaseWorksheet = {
      ...mockCaseWorksheet,
      finalBriefDueDate: mockFinalBriefDueDate,
    };
    expect(
      applicationContext.getPersistenceGateway().updateCaseWorksheet,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseWorksheet: expectedUpdatedCaseWorksheet,
      judgeUserId: judgeUser.userId,
    });
    expect(result).toEqual(expectedUpdatedCaseWorksheet);
  });
});
