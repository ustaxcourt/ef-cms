import {
  CASE_STATUS_TYPES,
  CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
  STATUS_OF_MATTER_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  MOCK_SUBMITTED_CASE,
  MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY,
  MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD,
} from '@shared/test/mockCase';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getCasesByStatusAndByJudgeInteractor } from './getCasesByStatusAndByJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '@shared/test/mockUsers';

describe('getCasesByStatusAndByJudgeInteractor', () => {
  const docketEntryWithoutCaseHistory = '115-23';

  const prohibitedDocketEntries = 'ODD, DEC, SDEC, OAD';
  let mockReturnedDocketNumbers: Array<{
    docketNumber: string;
    leadDocketNumber?: string;
    caseStatusHistory?: {
      changedBy: string;
      date: string;
      updatedCaseStatus: string;
    }[];
  }> = [];
  let mockReturnedDocketNumbersToFilterOut: string[] = [];

  const mockValidRequest = {
    judges: [judgeUser.name],
    pageNumber: 0,
    pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
    statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
  };

  const currentDateInIsoFormat: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      FORMATS.ISO,
    );

  const expectedCaseStatus = {
    changedBy: 'Private Practitioner',
    date: currentDateInIsoFormat,
    updatedCaseStatus: CASE_STATUS_TYPES.new,
  };
  const mockCaseInfo = {
    caseCaption: 'CASE CAPTION',
    caseStatusHistory: [expectedCaseStatus],
    docketNumber: MOCK_SUBMITTED_CASE.docketNumber,
    docketNumberWithSuffix: `${MOCK_SUBMITTED_CASE.docketNumber}R`,
    petitioners: [],
    status: CASE_STATUS_TYPES.cav,
  };
  const mockCaseWorksheet = {
    docketNumber: '101-20',
    finalBriefDueDate: '01-01-2022',
    primaryIssue: 'nothing',
    statusOfMatter: STATUS_OF_MATTER_OPTIONS[1],
  } as RawCaseWorksheet;

  beforeAll(() => {
    applicationContext.getSearchClient().count = jest.fn();
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockImplementation(
        () => mockReturnedDocketNumbers,
      );
    applicationContext
      .getPersistenceGateway()
      .getCaseWorksheet.mockImplementation(() => mockCaseWorksheet);
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
  });

  it('should return an error when the user is not authorized to generate the report', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      getCasesByStatusAndByJudgeInteractor(
        applicationContext,
        mockValidRequest,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', async () => {
    await expect(
      getCasesByStatusAndByJudgeInteractor(applicationContext, {
        judges: [judgeUser.name],
        statuses: [undefined as any],
      }),
    ).rejects.toThrow();
  });

  it('calls getDocketNumbersByStatusAndByJudge with excludeMemberCases flag = true (stripping out the consolidated member case)', async () => {
    await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway()
        .getDocketNumbersByStatusAndByJudge,
    ).toHaveBeenCalledWith({
      applicationContext,
      params: {
        excludeMemberCases: true,
        judges: mockValidRequest.judges,
        statuses: mockValidRequest.statuses,
      },
    });
  });

  it(`should return an array of 1 case (stripping out the cases with served ${prohibitedDocketEntries} docket entries, no consolidated cases, or no caseStatusHistory)`, async () => {
    mockReturnedDocketNumbers = [
      { ...mockCaseInfo, docketNumber: MOCK_SUBMITTED_CASE.docketNumber },
      {
        ...mockCaseInfo,
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        ...mockCaseInfo,
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
      },
      {
        ...mockCaseInfo,
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
      },
      {
        ...mockCaseInfo,
        docketNumber: MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        ...mockCaseInfo,
        caseStatusHistory: undefined,
        docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber,
      },
    ];

    mockReturnedDocketNumbersToFilterOut = [
      MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
      MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber,
      MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
      MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersWithServedEventCodes.mockReturnValue(
        mockReturnedDocketNumbersToFilterOut,
      );

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '101-18',
        }),
      ]),
    );

    expect(result.cases).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: docketEntryWithoutCaseHistory,
        }),
        expect.objectContaining({
          docketNumber:
            MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
        }),
        expect.objectContaining({
          docketNumber:
            MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
        }),
        expect.objectContaining({
          docketNumber:
            MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
        }),
        expect.objectContaining({
          docketNumber: MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber,
        }),
      ]),
    );

    expect(result.totalCount).toEqual(1);
  });

  it('should add a caseWorksheet field to cases returned', async () => {
    mockReturnedDocketNumbers = [
      { ...mockCaseInfo, docketNumber: '101-23' },
      {
        ...mockCaseInfo,
        docketNumber: '102-23',
      },
    ];

    mockReturnedDocketNumbersToFilterOut = [];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersWithServedEventCodes.mockReturnValue(
        mockReturnedDocketNumbersToFilterOut,
      );

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          caseWorksheet: mockCaseWorksheet,
          docketNumber: '101-23',
        }),
        expect.objectContaining({
          caseWorksheet: mockCaseWorksheet,
          docketNumber: '102-23',
        }),
      ]),
    );

    expect(result.totalCount).toEqual(2);
  });
});
