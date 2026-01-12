import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/caseWorksheets/mocks.jest';
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
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseWorksheetsByDocketNumber as getCaseWorksheetsByDocketNumberMock } from '@web-api/persistence/postgres/caseWorksheets/getCaseWorksheetsByDocketNumber';
import { judgeUser } from '@shared/test/mockUsers';
import {
  mockJudgeUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getDocketNumbersByStatusAndByJudge as getDocketNumbersByStatusAndByJudgeMock } from '@web-api/persistence/postgres/cases/reports/getDocketNumbersByStatusAndByJudge';
import { getConsolidatedCasesCount as getConsolidatedCasesCountMock } from '@web-api/persistence/postgres/cases/getConsolidatedCasesCount';

const getCaseWorksheetsByDocketNumber =
  getCaseWorksheetsByDocketNumberMock as jest.Mock;

const getDocketNumbersByStatusAndByJudge =
  getDocketNumbersByStatusAndByJudgeMock as jest.Mock;

const getConsolidatedCasesCount = jest.mocked(getConsolidatedCasesCountMock);

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
    getCaseWorksheetsByDocketNumber.mockImplementation(() => [
      mockCaseWorksheet10123,
      mockCaseWorksheet10223,
    ]);
  });
  getDocketNumbersByStatusAndByJudge.mockResolvedValue(
    mockGetDocketNumbersByStatusAndByJudgeResult,
  );

  it('should return an error when the user is not authorized to generate the report', async () => {
    await expect(
      getCaseWorksheetsByJudgeInteractor(
        mockValidRequest,
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', async () => {
    await expect(
      getCaseWorksheetsByJudgeInteractor(
        {
          judges: [judgeUser.name],
          statuses: [undefined as any],
        },
        mockJudgeUser,
      ),
    ).rejects.toThrow();
  });

  it('calls getDocketNumbersByStatusAndByJudge with excludeMemberCases flag = true (stripping out the consolidated member case)', async () => {
    await getCaseWorksheetsByJudgeInteractor(mockValidRequest, mockJudgeUser);

    expect(getDocketNumbersByStatusAndByJudge).toHaveBeenCalledWith({
      params: {
        excludeMemberCases: true,
        judges: mockValidRequest.judges,
        statuses: mockValidRequest.statuses,
      },
    });
  });

  it('should return an array of cases with formattedCaseCount', async () => {
    getConsolidatedCasesCount.mockResolvedValue(3);

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

    getDocketNumbersByStatusAndByJudge.mockResolvedValueOnce(
      mockGetDocketNumbersByStatusAndByJudgeResult,
    );

    const result = await getCaseWorksheetsByJudgeInteractor(
      mockValidRequest,
      mockJudgeUser,
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

    getDocketNumbersByStatusAndByJudge.mockResolvedValueOnce(
      mockGetDocketNumbersByStatusAndByJudgeResult,
    );

    const result = await getCaseWorksheetsByJudgeInteractor(
      mockValidRequest,
      mockJudgeUser,
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
