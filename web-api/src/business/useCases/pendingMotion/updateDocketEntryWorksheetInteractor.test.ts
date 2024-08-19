import { InvalidEntityError, UnauthorizedError } from '@web-api/errors/errors';
import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockJudgeUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { updateDocketEntryWorksheetInteractor } from '@web-api/business/useCases/pendingMotion/updateDocketEntryWorksheetInteractor';

describe('updateDocketEntryWorksheetInteractor', () => {
  const TEST_DOCKET_ENTRY_ID = '06f60736-5f37-4590-b62a-5c7edf84ffc6';
  const TEST_JUDGE_USER_ID = 'TEST_JUDGE_USER_ID';

  const VALID_WORKSHEET: RawDocketEntryWorksheet = {
    docketEntryId: TEST_DOCKET_ENTRY_ID,
    finalBriefDueDate: '2023-07-29',
    primaryIssue: 'tests primaryIssue',
    statusOfMatter: 'AwaitingConsideration',
  };

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .getJudgeForUserHelper.mockReturnValue({ userId: TEST_JUDGE_USER_ID });

    applicationContext
      .getPersistenceGateway()
      .updateDocketEntryWorksheet.mockReturnValue(null);
  });

  it('should throw an error when the user does not have access to the case worksheet feature', async () => {
    await expect(
      updateDocketEntryWorksheetInteractor(
        applicationContext,
        {
          worksheet: VALID_WORKSHEET,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the provided worksheet fails validation', async () => {
    await expect(
      updateDocketEntryWorksheetInteractor(
        applicationContext,
        {
          worksheet: { ...VALID_WORKSHEET, docketEntryId: 'NOT A UUID' },
        },
        mockJudgeUser,
      ),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should call persistence with correct data when worksheet is valid', async () => {
    const results = await updateDocketEntryWorksheetInteractor(
      applicationContext,
      {
        worksheet: VALID_WORKSHEET,
      },
      mockJudgeUser,
    );

    const updateDocketEntryWorksheetCallCount =
      applicationContext.getPersistenceGateway().updateDocketEntryWorksheet.mock
        .calls.length;

    expect(updateDocketEntryWorksheetCallCount).toEqual(1);

    const { docketEntryWorksheet, judgeUserId } =
      applicationContext.getPersistenceGateway().updateDocketEntryWorksheet.mock
        .calls[0][0];

    expect(docketEntryWorksheet).toEqual({
      docketEntryId: TEST_DOCKET_ENTRY_ID,
      entityName: 'DocketEntryWorksheet',
      finalBriefDueDate: '2023-07-29',
      primaryIssue: 'tests primaryIssue',
      statusOfMatter: 'AwaitingConsideration',
    });
    expect(judgeUserId).toEqual(TEST_JUDGE_USER_ID);

    expect(results).toEqual({
      docketEntryId: TEST_DOCKET_ENTRY_ID,
      entityName: 'DocketEntryWorksheet',
      finalBriefDueDate: '2023-07-29',
      primaryIssue: 'tests primaryIssue',
      statusOfMatter: 'AwaitingConsideration',
    });
  });
});
