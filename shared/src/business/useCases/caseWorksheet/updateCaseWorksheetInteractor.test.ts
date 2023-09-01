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
        updatedCaseWorksheet: mockCaseWorksheet,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the updated case worksheet is invalid', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    await expect(
      updateCaseWorksheetInteractor(applicationContext, {
        updatedCaseWorksheet: {
          ...mockCaseWorksheet,
          finalBriefDueDate: 'abc',
        }, // finalBriefDueDate should be a date formatted as YYYY-MM-DD
      }),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should persist the case worksheet when the updates are valid', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    await updateCaseWorksheetInteractor(applicationContext, {
      updatedCaseWorksheet: mockCaseWorksheet,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCaseWorksheet,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseWorksheet: {
        ...mockCaseWorksheet,
        caseWorksheetId: expect.anything(),
        entityName: 'CaseWorksheet',
        finalBriefDueDate: undefined,
        statusOfMatter: undefined,
      },
      judgeUserId: judgeUser.userId,
    });
  });
});
