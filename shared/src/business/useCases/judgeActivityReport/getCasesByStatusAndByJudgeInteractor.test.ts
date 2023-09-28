import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  JudgeActivityReportCavAndSubmittedCasesRequest,
  getCasesByStatusAndByJudgeInteractor,
} from './getCasesByStatusAndByJudgeInteractor';
import {
  MOCK_CASE,
  MOCK_SUBMITTED_CASE,
  MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY,
  MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD,
} from '@shared/test/mockCase';
import { MOCK_CASE_WORKSHEET } from '@shared/test/mockCaseWorksheet';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { applicationContext } from '../../test/createTestApplicationContext';
import { judgeUser, petitionsClerkUser } from '@shared/test/mockUsers';

describe('getCasesByStatusAndByJudgeInteractor', () => {
  let mockGetDocketNumbersByStatusAndByJudgeResult: RawCase[] = [];

  let mockGetDocketNumbersWithServedEventCodesResult: string[] = [];

  const mockValidRequest: JudgeActivityReportCavAndSubmittedCasesRequest = {
    judges: [judgeUser.name],
    statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
  };

  const mockCaseInfo = {
    ...MOCK_CASE,
    caseCaption: 'CASE CAPTION',
    caseStatusHistory: [
      {
        changedBy: 'Private Practitioner',
        date: '2018-07-25T00:00:00.000-04:00',
        updatedCaseStatus: CASE_STATUS_TYPES.new,
      },
    ],
    docketNumber: MOCK_SUBMITTED_CASE.docketNumber,
    docketNumberWithSuffix: `${MOCK_SUBMITTED_CASE.docketNumber}R`,
    petitioners: [],
    status: CASE_STATUS_TYPES.cav,
  };

  const mockCaseWorksheet10123: RawCaseWorksheet = {
    ...MOCK_CASE_WORKSHEET,
    docketNumber: '101-23',
  };
  const mockCaseWorksheet10223: RawCaseWorksheet = {
    ...MOCK_CASE_WORKSHEET,
    docketNumber: '102-23',
  };

  beforeAll(() => {
    applicationContext.getSearchClient().count = jest.fn();
    applicationContext
      .getPersistenceGateway()
      .getCaseWorksheetsByDocketNumber.mockImplementation(() => [
        mockCaseWorksheet10123,
        mockCaseWorksheet10223,
      ]);
  });
  applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByStatusAndByJudge.mockImplementation(
      () => mockGetDocketNumbersByStatusAndByJudgeResult,
    );

  applicationContext
    .getPersistenceGateway()
    .getDocketNumbersWithServedEventCodes.mockImplementation(
      () => mockGetDocketNumbersWithServedEventCodesResult,
    );

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

  it('should return an array of 1 case (stripping out the cases with served ODD, DEC, SDEC, OAD docket entries and no consolidated cases)', async () => {
    mockGetDocketNumbersByStatusAndByJudgeResult = [
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
        caseStatusHistory: [],
        docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber,
      },
    ];
    mockGetDocketNumbersWithServedEventCodesResult = [
      MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber,
      MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
      MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
      MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValueOnce(
        mockGetDocketNumbersByStatusAndByJudgeResult,
      );

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersWithServedEventCodes.mockReturnValueOnce(
        mockGetDocketNumbersWithServedEventCodesResult,
      );

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: MOCK_SUBMITTED_CASE.docketNumber,
        }),
        expect.objectContaining({
          docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber,
        }),
      ]),
    );
    expect(result.totalCount).toEqual(2);
  });

  it('should paginate the results when page number and page size are provided', async () => {
    mockGetDocketNumbersByStatusAndByJudgeResult = [
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
    ];
    mockGetDocketNumbersWithServedEventCodesResult = [];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValueOnce(
        mockGetDocketNumbersByStatusAndByJudgeResult,
      );

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersWithServedEventCodes.mockReturnValueOnce(
        mockGetDocketNumbersWithServedEventCodesResult,
      );

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      {
        judges: [judgeUser.name],
        statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
      },
    );

    expect(result.totalCount).toBe(
      mockGetDocketNumbersByStatusAndByJudgeResult.length,
    );
  });

  it('should return all results when page number and page size are not provided', async () => {
    mockGetDocketNumbersByStatusAndByJudgeResult = [
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
    ];
    mockGetDocketNumbersWithServedEventCodesResult = [];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValueOnce(
        mockGetDocketNumbersByStatusAndByJudgeResult,
      );

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersWithServedEventCodes.mockReturnValueOnce(
        mockGetDocketNumbersWithServedEventCodesResult,
      );

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      {
        judges: [judgeUser.name],
        statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
      },
    );

    expect(result.totalCount).toBe(
      mockGetDocketNumbersByStatusAndByJudgeResult.length,
    );
  });

  it('should add a caseWorksheet field to cases returned', async () => {
    mockGetDocketNumbersByStatusAndByJudgeResult = [
      { ...mockCaseInfo, docketNumber: '101-23' },
      {
        ...mockCaseInfo,
        docketNumber: '102-23',
      },
    ];

    mockGetDocketNumbersWithServedEventCodesResult = [];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValueOnce(
        mockGetDocketNumbersByStatusAndByJudgeResult,
      );

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersWithServedEventCodes.mockReturnValueOnce(
        mockGetDocketNumbersWithServedEventCodesResult,
      );

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    const actualCases = result.cases.map(aCase => ({
      caseWorksheet: aCase.caseWorksheet,
      docketNumber: aCase.docketNumber,
    }));
    console.log(actualCases);
    expect(actualCases).toEqual([
      {
        caseWorksheet: mockCaseWorksheet10123,
        docketNumber: '101-23',
      },
      {
        caseWorksheet: mockCaseWorksheet10223,
        docketNumber: '102-23',
      },
    ]);
    expect(result.totalCount).toEqual(2);
  });
});
