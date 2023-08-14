import {
  CASE_STATUS_TYPES,
  CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
} from '../../entities/EntityConstants';
import {
  MOCK_CAV_LEAD_CASE,
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_SUBMITTED_CASE,
  MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY,
  MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD,
} from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  docketClerkUser,
  judgeUser,
  petitionsClerkUser,
} from '../../../test/mockUsers';
import { getCasesByStatusAndByJudgeInteractor } from './getCasesByStatusAndByJudgeInteractor';

describe('getCasesByStatusAndByJudgeInteractor', () => {
  const docketEntryWithoutCaseHistory = '115-23';

  const prohibitedDocketEntries = 'ODD, DEC, SDEC, OAD';
  let mockReturnedDocketNumbers: Array<{ docketNumber: string }> = [];

  let expectedConsolidatedCasesGroupCountMap = {};

  const mockCavConsolidatedMemberCase = {
    ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
    associatedJudge: judgeUser.name,
    caseStatusHistory: [
      {
        changedBy: docketClerkUser.name,
        date: '2023-05-13T14:19:28.717Z',
        updatedCaseStatus: CASE_STATUS_TYPES.cav,
      },
    ],
    sortableDocketNumber: 2019000110,
    status: CASE_STATUS_TYPES.cav,
  };

  const mockValidRequest = {
    judges: [judgeUser.name],
    pageNumber: 0,
    pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
    statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
  };

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

  it('should return an array of 2 cases and consolidatedCasesGroupMap (stripping out the consolidated member case)', async () => {
    mockReturnedDocketNumbers = [
      { docketNumber: MOCK_SUBMITTED_CASE.docketNumber },
      { docketNumber: MOCK_CAV_LEAD_CASE.docketNumber },
      { docketNumber: mockCavConsolidatedMemberCase.docketNumber },
      { docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber },
    ];

    const casesForLeadDocketNumber = [
      MOCK_CAV_LEAD_CASE,
      mockCavConsolidatedMemberCase,
    ];

    expectedConsolidatedCasesGroupCountMap = {
      [`${MOCK_CAV_LEAD_CASE.docketNumber}`]: casesForLeadDocketNumber.length,
    };

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue({
        foundCases: mockReturnedDocketNumbers,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(MOCK_SUBMITTED_CASE)
      .mockResolvedValueOnce(MOCK_CAV_LEAD_CASE)
      .mockResolvedValueOnce(mockCavConsolidatedMemberCase);

    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValueOnce(
        casesForLeadDocketNumber,
      );

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases.length).toEqual(2);
    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '101-18',
        }),
        expect.objectContaining({
          docketNumber: '109-19',
        }),
      ]),
    );

    expect(result.cases).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: docketEntryWithoutCaseHistory,
        }),
      ]),
    );

    expect(result.consolidatedCasesGroupCountMap).toEqual(
      expectedConsolidatedCasesGroupCountMap,
    );
    expect(result.totalCount).toEqual(2);
  });

  it(`should return an array of 2 cases and consolidatedCasesGroupMap (stripping out the member case of consolidated cases and cases with ${prohibitedDocketEntries} docket entries)`, async () => {
    mockReturnedDocketNumbers = [
      { docketNumber: MOCK_SUBMITTED_CASE.docketNumber },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
      },
      { docketNumber: MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber },
      { docketNumber: MOCK_CAV_LEAD_CASE.docketNumber },
      { docketNumber: mockCavConsolidatedMemberCase.docketNumber },
      { docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber },
    ];

    const casesForLeadDocketNumber = [
      MOCK_CAV_LEAD_CASE,
      mockCavConsolidatedMemberCase,
    ];

    expectedConsolidatedCasesGroupCountMap = {
      [`${MOCK_CAV_LEAD_CASE.docketNumber}`]: casesForLeadDocketNumber.length,
    };

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue({
        foundCases: mockReturnedDocketNumbers,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(MOCK_SUBMITTED_CASE)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_CAV_LEAD_CASE)
      .mockResolvedValueOnce(mockCavConsolidatedMemberCase)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD);

    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValueOnce(
        casesForLeadDocketNumber,
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
        expect.objectContaining({
          docketNumber: '109-19',
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

    expect(result.consolidatedCasesGroupCountMap).toEqual(
      expectedConsolidatedCasesGroupCountMap,
    );
    expect(result.totalCount).toEqual(2);
  });

  it(`should return an array of 1 case and consolidatedCasesGroupMap (stripping out the cases with served ${prohibitedDocketEntries} docket entries and no consolidated cases)`, async () => {
    mockReturnedDocketNumbers = [
      { docketNumber: MOCK_SUBMITTED_CASE.docketNumber },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
      },
      { docketNumber: MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber },
      { docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue({
        foundCases: mockReturnedDocketNumbers,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(MOCK_SUBMITTED_CASE)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD);

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

    expect(result.consolidatedCasesGroupCountMap).toEqual({});
    expect(result.totalCount).toEqual(1);
  });

  it(`should return an array of 5 cases (4 cases containing ${prohibitedDocketEntries} docket entries in DRAFT statuses) and consolidatedCasesGroupMap`, async () => {
    MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketEntries[0],
        isDraft: true,
        servedAt: undefined,
        servedParties: undefined,
      },
    ];
    MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketEntries[0],
        isDraft: true,
        servedAt: undefined,
        servedParties: undefined,
      },
    ];
    MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketEntries[0],
        isDraft: true,
        servedAt: undefined,
        servedParties: undefined,
      },
    ];
    MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketEntries[0],
        isDraft: true,
        servedAt: undefined,
        servedParties: undefined,
      },
    ];

    mockReturnedDocketNumbers = [
      { docketNumber: MOCK_SUBMITTED_CASE.docketNumber },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
      },
      { docketNumber: MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber },
      { docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue({
        foundCases: mockReturnedDocketNumbers,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(MOCK_SUBMITTED_CASE)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD);

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

    expect(result.cases).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: docketEntryWithoutCaseHistory,
        }),
      ]),
    );

    expect(result.consolidatedCasesGroupCountMap).toEqual({});
    expect(result.totalCount).toEqual(5);
  });

  it(`should return an array of 5 cases (4 cases containing UNSERVED ${prohibitedDocketEntries} docket entries) and consolidatedCasesGroupMap`, async () => {
    MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketEntries[0],
        isDraft: false,
        servedAt: undefined,
        servedParties: undefined,
      },
    ];

    MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketEntries[0],
        isDraft: false,
        servedAt: undefined,
        servedParties: undefined,
      },
    ];
    MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketEntries[0],
        isDraft: false,
        servedAt: undefined,
        servedParties: undefined,
      },
    ];
    MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketEntries[0],
        isDraft: false,
        servedAt: undefined,
        servedParties: undefined,
      },
    ];

    mockReturnedDocketNumbers = [
      { docketNumber: MOCK_SUBMITTED_CASE.docketNumber },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
      },
      { docketNumber: MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber },
      { docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue({
        foundCases: mockReturnedDocketNumbers,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(MOCK_SUBMITTED_CASE)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD);

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

    expect(result.cases).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: docketEntryWithoutCaseHistory,
        }),
      ]),
    );

    expect(result.consolidatedCasesGroupCountMap).toEqual({});
    expect(result.totalCount).toEqual(5);
  });

  it(`should return an array of 5 cases (4 cases containing ${prohibitedDocketEntries} docket entries that have been stricken) and consolidatedCasesGroupMap`, async () => {
    MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketEntries[0],
        isStricken: true,
        strickenAt: '2023-05-25T16:15:59.058Z',
        strickenBy: 'Test Docketclerk',
        strickenByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ];

    MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketEntries[0],
        isStricken: true,
        strickenAt: '2023-05-25T16:15:59.058Z',
        strickenBy: 'Test Docketclerk',
        strickenByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ];
    MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketEntries[0],
        isStricken: true,
        strickenAt: '2023-05-25T16:15:59.058Z',
        strickenBy: 'Test Docketclerk',
        strickenByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ];
    MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketEntries = [
      {
        ...MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketEntries[0],
        isStricken: true,
        strickenAt: '2023-05-25T16:15:59.058Z',
        strickenBy: 'Test Docketclerk',
        strickenByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ];
    mockReturnedDocketNumbers = [
      { docketNumber: MOCK_SUBMITTED_CASE.docketNumber },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
      },
      { docketNumber: MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber },
      { docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue({
        foundCases: mockReturnedDocketNumbers,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(MOCK_SUBMITTED_CASE)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD)
      .mockResolvedValueOnce(MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD);

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
    expect(result.cases).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: docketEntryWithoutCaseHistory,
        }),
      ]),
    );

    expect(result.consolidatedCasesGroupCountMap).toEqual({});
    expect(result.totalCount).toEqual(5);
  });
});
