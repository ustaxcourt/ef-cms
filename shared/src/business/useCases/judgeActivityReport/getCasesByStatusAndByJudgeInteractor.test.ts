import {
  CASE_STATUS_TYPES,
  CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
} from '@shared/business/entities/EntityConstants';
import {
  MOCK_CAV_CONSOLIDATED_MEMBER_CASE,
  MOCK_CAV_LEAD_CASE,
  MOCK_SUBMITTED_CASE,
  MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY,
  MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD,
  MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD,
} from '@shared/test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
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
  let mockReturnedCasesToFilterOut: Array<{
    docketNumber: string;
  }> = [];

  let expectedConsolidatedCasesGroupCountMap = {};

  const mockValidRequest = {
    judges: [judgeUser.name],
    pageNumber: 0,
    pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
    statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
  };

  const expectedCaseStatus = {
    changedBy: 'Private Practitioner',
    date: createISODateString(),
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
      { ...mockCaseInfo, docketNumber: MOCK_SUBMITTED_CASE.docketNumber },
      {
        ...mockCaseInfo,
        docketNumber: MOCK_CAV_LEAD_CASE.docketNumber,
        leadDocketNumber: MOCK_CAV_LEAD_CASE.docketNumber,
      },
      {
        ...mockCaseInfo,
        docketNumber: MOCK_CAV_CONSOLIDATED_MEMBER_CASE.docketNumber,
        leadDocketNumber: MOCK_CAV_LEAD_CASE.docketNumber,
      },
      {
        ...mockCaseInfo,
        caseStatusHistory: undefined,
        docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber,
      },
    ];

    const casesForLeadDocketNumber = [
      MOCK_CAV_LEAD_CASE,
      MOCK_CAV_CONSOLIDATED_MEMBER_CASE,
    ];

    expectedConsolidatedCasesGroupCountMap = {
      [`${MOCK_CAV_LEAD_CASE.docketNumber}`]: casesForLeadDocketNumber.length,
    };

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getCasesByEventCodes.mockReturnValue([]);

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
        docketNumber: MOCK_CAV_LEAD_CASE.docketNumber,
        leadDocketNumber: MOCK_CAV_LEAD_CASE.docketNumber,
      },
      {
        ...mockCaseInfo,
        docketNumber: MOCK_CAV_CONSOLIDATED_MEMBER_CASE.docketNumber,
        leadDocketNumber: MOCK_CAV_LEAD_CASE.docketNumber,
      },
      {
        ...mockCaseInfo,
        caseStatusHistory: undefined,
        docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber,
      },
    ];

    mockReturnedCasesToFilterOut = [
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber: MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber: MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY.docketNumber,
      },
    ];

    const casesForLeadDocketNumber = [
      MOCK_CAV_LEAD_CASE,
      MOCK_CAV_CONSOLIDATED_MEMBER_CASE,
    ];

    expectedConsolidatedCasesGroupCountMap = {
      [`${MOCK_CAV_LEAD_CASE.docketNumber}`]: casesForLeadDocketNumber.length,
    };

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getCasesByEventCodes.mockReturnValue(mockReturnedCasesToFilterOut);

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

    mockReturnedCasesToFilterOut = [
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber: MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD.docketNumber,
      },
      {
        docketNumber:
          MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD.docketNumber,
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getCasesByEventCodes.mockReturnValue(mockReturnedCasesToFilterOut);

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
});
