import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { applicationContext } from '../../test/createTestApplicationContext';
import { deletePrimaryIssueInteractor } from './deletePrimaryIssueInteractor';
import { judgeUser, petitionsClerkUser } from '@shared/test/mockUsers';

describe('deletePrimaryIssueInteractor', () => {
  const mockCaseWorksheet: RawCaseWorksheet = {
    docketNumber: '101-23',
    entityName: 'CaseWorksheet',
    primaryIssue: 'Don`t go chasin waterfalls',
  };

  it('should throw an error when the user does not have access to the case worksheet feature', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser); // Only judges and judges chambers have access to case worksheets

    await expect(
      deletePrimaryIssueInteractor(applicationContext, {
        docketNumber: mockCaseWorksheet.docketNumber,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the docket number was not provided as part of the request', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    await expect(
      deletePrimaryIssueInteractor(applicationContext, {
        docketNumber: undefined as any,
      }),
    ).rejects.toThrow(InvalidRequest);
  });

  it('should call the persistence method with the primaryIssue deleted from the worksheet', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    const TEST_WORKSHEET = {
      docketNumber: '111-11',
      primaryIssue: 'TEST_PRIMARY_ISSUE',
    };
    applicationContext
      .getPersistenceGateway()
      .getCaseWorksheet.mockReturnValue(TEST_WORKSHEET);

    const worksheet = await deletePrimaryIssueInteractor(applicationContext, {
      docketNumber: '111-11',
    });

    const EXPECTED_WORKSHEET = {
      docketNumber: '111-11',
      entityName: 'CaseWorksheet',
      finalBriefDueDate: undefined,
      statusOfMatter: undefined,
    };

    expect(
      applicationContext.getPersistenceGateway().updateCaseWorksheet,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseWorksheet: EXPECTED_WORKSHEET,
      judgeUserId: judgeUser.userId,
    });

    expect(worksheet).toEqual(EXPECTED_WORKSHEET);
  });
});
