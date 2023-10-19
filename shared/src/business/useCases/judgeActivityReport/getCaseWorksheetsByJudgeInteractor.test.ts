import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  GetCasesByStatusAndByJudgeRequest,
  getCaseWorksheetsByJudgeInteractor,
} from './getCaseWorksheetsByJudgeInteractor';
import {
  MOCK_CASE,
  MOCK_SUBMITTED_CASE,
  MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY,
} from '@shared/test/mockCase';
import { MOCK_CASE_WORKSHEET } from '@shared/test/mockCaseWorksheet';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { applicationContext } from '../../test/createTestApplicationContext';
import { judgeUser, petitionsClerkUser } from '@shared/test/mockUsers';

describe('getCaseWorksheetsByJudgeInteractor', () => {
  let mockGetDocketNumbersByStatusAndByJudgeResult: RawCase[] = [];

  const mockValidRequest: GetCasesByStatusAndByJudgeRequest = {
    judges: [judgeUser.name],
    statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
  };

  const mockCaseInfo: RawCase = {
    ...MOCK_CASE,
    caseCaption: 'CASE CAPTION',
    caseStatusHistory: [
      {
        changedBy: 'Private Practitioner',
        date: '2018-07-25T00:00:00.000-04:00',
        updatedCaseStatus: CASE_STATUS_TYPES.cav,
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

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
  });

  it('should return an error when the user is not authorized to generate the report', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      getCaseWorksheetsByJudgeInteractor(applicationContext, mockValidRequest),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', async () => {
    await expect(
      getCaseWorksheetsByJudgeInteractor(applicationContext, {
        judges: [judgeUser.name],
        statuses: [undefined as any],
      }),
    ).rejects.toThrow();
  });

  it('calls getDocketNumbersByStatusAndByJudge with excludeMemberCases flag = true (stripping out the consolidated member case)', async () => {
    await getCaseWorksheetsByJudgeInteractor(
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

  it('should return an array of cases with formattedCaseCount', async () => {
    mockGetDocketNumbersByStatusAndByJudgeResult = [
      {
        ...mockCaseInfo,
        docketNumber: MOCK_SUBMITTED_CASE.docketNumber,
        leadDocketNumber: MOCK_SUBMITTED_CASE.docketNumber,
      },
      {
        ...mockCaseInfo,
        docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber,
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValueOnce(
        mockGetDocketNumbersByStatusAndByJudgeResult,
      );
    applicationContext
      .getPersistenceGateway()
      .getCountOfConsolidatedCases.mockReturnValueOnce(3);

    const result = await getCaseWorksheetsByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: MOCK_SUBMITTED_CASE.docketNumber,
          formattedCaseCount: 3,
        }),
        expect.objectContaining({
          docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber,
          formattedCaseCount: 1,
        }),
      ]),
    );
    expect(result.cases.length).toEqual(2);
  });

  it('should add a caseWorksheet field to cases returned', async () => {
    mockGetDocketNumbersByStatusAndByJudgeResult = [
      { ...mockCaseInfo, docketNumber: '101-23' },
      {
        ...mockCaseInfo,
        docketNumber: '102-23',
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValueOnce(
        mockGetDocketNumbersByStatusAndByJudgeResult,
      );

    const result = await getCaseWorksheetsByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    const actualCases = result.cases.map(aCase => ({
      caseWorksheet: aCase.caseWorksheet,
      docketNumber: aCase.docketNumber,
    }));
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
  });
});
