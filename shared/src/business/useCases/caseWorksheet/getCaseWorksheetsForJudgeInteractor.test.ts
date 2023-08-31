import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '../../../errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getCaseWorksheetsForJudgeInteractor } from './getCaseWorksheetsForJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '@shared/test/mockUsers';

describe('getCaseWorksheetsForJudgeInteractor', () => {
  it('should throw an erorr when the user does not have permission to the case worksheet feature', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      getCaseWorksheetsForJudgeInteractor(applicationContext),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should call persistence method and return all CAV and submitted case worksheets for a judge', async () => {
    const TEST_WORKSHEET: RawCaseWorksheet = {
      docketNumber: '123-45',
      entityName: 'CaseWorksheet',
      finalBriefDueDate: '2023-08-29',
      primaryIssue: 'Something something something',
      statusOfMatter: STATUS_OF_MATTER_OPTIONS[0],
    };
    const TEST_RAW_WORKSHEETS = [
      {
        extraProp: 'remove_me',
        ...TEST_WORKSHEET,
      },
    ];

    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseWorksheets.mockReturnValue(TEST_RAW_WORKSHEETS);

    const result =
      await getCaseWorksheetsForJudgeInteractor(applicationContext);

    const EXPECTED_WORKSHEETS = [TEST_WORKSHEET];
    expect(result).toEqual(EXPECTED_WORKSHEETS);
    expect(
      applicationContext.getPersistenceGateway().getCaseWorksheets.mock
        .calls[0][1],
    ).toEqual({ judgeId: judgeUser.userId });
  });
});
