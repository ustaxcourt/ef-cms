import {
  CASE_STATUS_TYPES,
  CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { JudgeActivityReportCavAndSubmittedCasesRequest } from '../../judgeActivityReportState';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getSubmittedAndCavCasesByJudgeAction } from './getSubmittedAndCavCasesByJudgeAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getSubmittedAndCavCasesByJudgeAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const lastDocketNumberForCavAndSubmittedCasesSearch = 1234;

  const requestFilters: JudgeActivityReportCavAndSubmittedCasesRequest = {
    judges: [judgeUser.name],
    pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
    searchAfter: lastDocketNumberForCavAndSubmittedCasesSearch,
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
      lastDocketNumberForCavAndSubmittedCasesSearch,
    };

    applicationContext
      .getUseCases()
      .getCasesByStatusAndByJudgeInteractor.mockReturnValueOnce(
        mockCustomCaseReportResponse,
      );
  });

  it('should retrieve cases with a status of submitted and cav for the provided judge from persistence and return it to props', async () => {
    const result = await runAction(getSubmittedAndCavCasesByJudgeAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        judgeActivityReport: {
          filters: requestFilters,
          lastIdsOfPages: [lastDocketNumberForCavAndSubmittedCasesSearch],
        },
      },
    });

    expect(
      (
        applicationContext.getUseCases()
          .getCasesByStatusAndByJudgeInteractor as jest.Mock
      ).mock.calls[0][1],
    ).toMatchObject(requestFilters);
    expect(result.output.cases).toBe(mockReturnedCases);
    expect(result.output.consolidatedCasesGroupCountMap).toMatchObject({
      '101-22': 3,
    });
  });

  it('should populate page ID tracking array when navigating to later pages', async () => {
    const page1SearchId = 123;
    mockCustomCaseReportResponse.lastDocketNumberForCavAndSubmittedCasesSearch =
      page1SearchId;

    await applicationContext
      .getUseCases()
      .getCustomCaseInventoryReportInteractor.mockResolvedValueOnce(
        mockCustomCaseReportResponse,
      );

    const result = await runAction(getSubmittedAndCavCasesByJudgeAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 1,
      },
      state: {
        judgeActivityReport: {
          filters: {
            judges: [judgeUser.name],
          },
          judgeActivityReportData: {},
          lastIdsOfPages: [
            lastDocketNumberForCavAndSubmittedCasesSearch,
            page1SearchId,
          ],
        },
      },
    });

    expect(result.output.lastDocketNumberForCavAndSubmittedCasesSearch).toEqual(
      page1SearchId,
    );
  });
});
