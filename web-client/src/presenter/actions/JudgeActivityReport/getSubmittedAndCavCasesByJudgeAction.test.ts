import {
  CASE_STATUS_TYPES,
  CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { JudgeActivityReportCavAndSubmittedCasesRequestType } from '../../judgeActivityReportState';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getSubmittedAndCavCasesByJudgeAction } from './getSubmittedAndCavCasesByJudgeAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
// import { runAction } from '@web-client/presenter/test.cerebral';
// runAction;
describe('getSubmittedAndCavCasesByJudgeAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const lastIdOfPage = {
    docketNumber: 1234,
  };
  const expectedRequest: JudgeActivityReportCavAndSubmittedCasesRequestType = {
    judgeName: judgeUser.name,
    pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
    searchAfter: lastIdOfPage,
    statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
  };
  const mockConsolidatedCasesGroupCount = { '101-22': 3 };

  let mockReturnedCases;
  let mockCustomCaseReportResponse;

  beforeEach(() => {
    mockReturnedCases = [
      {
        docketNumber: '101-22',
        leadDocketNumber: '101-22',
        status: 'Submitted',
      },
      { docketNumber: '111-11', status: 'Submitted' },
      { docketNumber: '134-21', status: 'CAV' },
    ];

    mockCustomCaseReportResponse = {
      cases: mockReturnedCases,
      consolidatedCasesGroupCountMap: mockConsolidatedCasesGroupCount,
      lastIdOfPage: { docketNumber: 1234 },
      totalCount: mockReturnedCases.length,
    };

    applicationContext
      .getUseCases()
      .getCasesByStatusAndByJudgeInteractor.mockReturnValueOnce(
        mockCustomCaseReportResponse,
      );
  });

  it('should retrieve cases with a status of submitted and cav for the provided judge from persistence and return it to props', async () => {
    const result = await runAction(
      getSubmittedAndCavCasesByJudgeAction as any,
      {
        modules: {
          presenter,
        },
        props: {
          selectedPage: 0,
        },
        state: {
          judgeActivityReport: {
            filters: expectedRequest,
            lastIdsOfPages: [lastIdOfPage],
          },
        },
      },
    );

    expect(
      (
        applicationContext.getUseCases()
          .getCasesByStatusAndByJudgeInteractor as jest.Mock
      ).mock.calls[0][1],
    ).toMatchObject(expectedRequest);
    expect(
      result.state.judgeActivityReport.judgeActivityReportData
        .submittedAndCavCasesByJudge,
    ).toBe(mockReturnedCases);
    expect(
      result.state.judgeActivityReport.judgeActivityReportData
        .consolidatedCasesGroupCountMap,
    ).toMatchObject({ '101-22': 3 });
  });

  it('should populate page ID tracking array when navigating to later pages', async () => {
    const page1SearchId = 123;
    const page2SearchId = 9001;
    mockCustomCaseReportResponse.lastIdOfPage = { docketNumber: page2SearchId };

    await applicationContext
      .getUseCases()
      .getCustomCaseInventoryReportInteractor.mockResolvedValueOnce(
        mockCustomCaseReportResponse,
      );

    const result = await runAction(
      getSubmittedAndCavCasesByJudgeAction as any,
      {
        modules: {
          presenter,
        },
        props: {
          selectedPage: 1,
        },
        state: {
          judgeActivityReport: {
            filters: {
              judgeName: expectedRequest.judgeName,
            },
            judgeActivityReportData: {},
            lastIdsOfPages: [lastIdOfPage, { docketNumber: page1SearchId }],
          },
        },
      },
    );

    expect(result.state.judgeActivityReport.lastIdsOfPages).toMatchObject([
      lastIdOfPage,
      { docketNumber: page1SearchId },
      { docketNumber: page2SearchId },
    ]);
  });

  it('should set submitted and Cav Cases on judgeActivityReport state', async () => {
    const mockSubmittedAndCavCasesByJudge = [
      {
        docketNumber: '101-22',
        leadDocketNumber: '101-22',
        status: 'Submitted',
      },
      { docketNumber: '111-11', status: 'Submitted' },
      { docketNumber: '134-21', status: 'CAV' },
    ];

    mockCustomCaseReportResponse.cases = mockSubmittedAndCavCasesByJudge;

    await applicationContext
      .getUseCases()
      .getCustomCaseInventoryReportInteractor.mockResolvedValueOnce(
        mockCustomCaseReportResponse,
      );

    const { state } = await runAction(
      getSubmittedAndCavCasesByJudgeAction as any,
      {
        modules: {
          presenter,
        },
        props: { selectedPage: 0 },
        state: {
          judgeActivityReport: {
            filters: {
              judgeName: expectedRequest.judgeName,
            },
            judgeActivityReportData: {
              submittedAndCavCasesByJudge: undefined,
            },
            lastIdsOfPages: [lastIdOfPage],
          },
        },
      },
    );

    expect(
      state.judgeActivityReport.judgeActivityReportData
        .submittedAndCavCasesByJudge,
    ).toBe(mockSubmittedAndCavCasesByJudge);
  });

  it('should set newly consolidated Cases group count map on judgeActivityReport state', async () => {
    const mockConsolidatedCasesGroupCountMap = new Map([['101-22', 5]]);

    mockCustomCaseReportResponse.consolidatedCasesGroupCountMap =
      mockConsolidatedCasesGroupCountMap;

    const { state } = await runAction(
      getSubmittedAndCavCasesByJudgeAction as any,
      {
        modules: {
          presenter,
        },
        props: { selectedPage: 0 },
        state: {
          judgeActivityReport: {
            filters: {
              judgeName: expectedRequest.judgeName,
            },
            judgeActivityReportData: {
              consolidatedCasesGroupCountMap: undefined,
            },
            lastIdsOfPages: [lastIdOfPage],
          },
        },
      },
    );

    expect(
      Object.fromEntries(
        state.judgeActivityReport.judgeActivityReportData
          .consolidatedCasesGroupCountMap,
      ),
    ).toMatchObject(Object.fromEntries(mockConsolidatedCasesGroupCountMap));
  });
});
