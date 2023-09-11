import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  colvinsChambersUser,
  judgeColvin,
  petitionsClerkUser,
} from '@shared/test/mockUsers';
import { getCaseWorksheetsForJudgeInteractor } from './getCaseWorksheetsForJudgeInteractor';

describe('getCaseWorksheetsForJudgeInteractor', () => {
  it('should throw an error when the user does not have permission to the case worksheet feature', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      getCaseWorksheetsForJudgeInteractor(applicationContext),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should fetch from persistence and return all case worksheets for the judge in the users` section when the current user is a chambers user', async () => {
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
    applicationContext.getCurrentUser.mockReturnValue(colvinsChambersUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockResolvedValue(colvinsChambersUser);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockResolvedValue(judgeColvin);
    applicationContext
      .getPersistenceGateway()
      .getCaseWorksheets.mockReturnValue(TEST_RAW_WORKSHEETS);

    const result = await getCaseWorksheetsForJudgeInteractor(
      applicationContext,
    );

    const EXPECTED_WORKSHEETS = [TEST_WORKSHEET];
    expect(result).toEqual(EXPECTED_WORKSHEETS);
    expect(
      applicationContext.getPersistenceGateway().getCaseWorksheets.mock
        .calls[0][1],
    ).toEqual({ judgeId: judgeColvin.userId });
  });

  it('should fetch from persistence and return all case worksheets for the current user when the current user is a judge', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeColvin);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockResolvedValue(judgeColvin);
    applicationContext
      .getPersistenceGateway()
      .getCaseWorksheets.mockReturnValue([]);

    await getCaseWorksheetsForJudgeInteractor(applicationContext);

    expect(
      applicationContext.getUseCaseHelpers().getJudgeInSectionHelper,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseWorksheets.mock
        .calls[0][1],
    ).toEqual({ judgeId: judgeColvin.userId });
  });
});
