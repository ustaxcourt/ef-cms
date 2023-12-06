import { CUSTOM_CASE_REPORT_PAGE_SIZE } from '@shared/business/entities/EntityConstants';
import {
  CustomCaseReportFilters,
  GetCustomCaseReportRequest,
  GetCustomCaseReportResponse,
} from '../../../../../web-api/src/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCustomCaseReportAction } from './getCustomCaseReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCustomCaseReportAction', () => {
  const lastCaseId = { pk: 'lastCaseId', receivedAt: 8394 };
  let mockCustomCaseReportResponse: GetCustomCaseReportResponse;
  let filterValues: CustomCaseReportFilters;
  let expectedRequest: GetCustomCaseReportRequest;

  beforeEach(() => {
    mockCustomCaseReportResponse = {
      foundCases: [],
      lastCaseId,
      totalCount: 0,
    };

    applicationContext
      .getUseCases()
      .getCustomCaseReportInteractor.mockResolvedValue(
        mockCustomCaseReportResponse,
      );

    presenter.providers.applicationContext = applicationContext;
    filterValues = {
      caseStatuses: ['Assigned - Case'],
      caseTypes: ['Deficiency'],
      endDate: '05/14/2022',
      filingMethod: 'electronic',
      highPriority: true,
      judges: ['Colvin'],
      preferredTrialCities: ['Jackson, Mississippi'],
      procedureType: 'All',
      startDate: '05/10/2022',
    };

    expectedRequest = {
      ...filterValues,
      endDate: '2022-05-15T03:59:59.999Z',
      pageSize: CUSTOM_CASE_REPORT_PAGE_SIZE,
      searchAfter: { pk: '', receivedAt: 0 },
      startDate: '2022-05-10T04:00:00.000Z',
    };
  });

  it('should get the custom case report with filter values that the user has selected', async () => {
    const result = await runAction(getCustomCaseReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        customCaseReport: {
          filters: filterValues,
          lastIdsOfPages: [{ pk: '', receivedAt: 0 }],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), expectedRequest);
    expect(result.state.customCaseReport.cases).toEqual(
      mockCustomCaseReportResponse.foundCases,
    );
    expect(result.state.customCaseReport.totalCases).toEqual(
      mockCustomCaseReportResponse.totalCount,
    );
    expect(result.state.customCaseReport.lastIdsOfPages).toMatchObject([
      { pk: '', receivedAt: 0 },
      lastCaseId,
    ]);
  });

  it('should populate page ID tracking array when navigating to later pages', async () => {
    const page2SearchId = { pk: 'page2', receivedAt: 890 };
    mockCustomCaseReportResponse = {
      foundCases: [],
      lastCaseId: page2SearchId,
      totalCount: 0,
    };
    applicationContext
      .getUseCases()
      .getCustomCaseReportInteractor.mockResolvedValue(
        mockCustomCaseReportResponse,
      );
    const page1SearchId = { pk: 'page1', receivedAt: 123 };
    const expectedRequestWithSearchAfter = {
      ...expectedRequest,
      searchAfter: page1SearchId,
    };

    const result = await runAction(getCustomCaseReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 1,
      },
      state: {
        customCaseReport: {
          filters: filterValues,
          lastIdsOfPages: [{ pk: '', receivedAt: 0 }, page1SearchId],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), expectedRequestWithSearchAfter);
    expect(result.state.customCaseReport.cases).toEqual(
      mockCustomCaseReportResponse.foundCases,
    );
    expect(result.state.customCaseReport.totalCases).toEqual(
      mockCustomCaseReportResponse.totalCount,
    );
    expect(result.state.customCaseReport.lastIdsOfPages).toMatchObject([
      { pk: '', receivedAt: 0 },
      page1SearchId,
      page2SearchId,
    ]);
  });

  it('should remove the high priority filter when the value is false', async () => {
    await runAction(getCustomCaseReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        customCaseReport: {
          filters: { ...filterValues, highPriority: false },
          lastIdsOfPages: [{ pk: '', receivedAt: 0 }],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      ...expectedRequest,
      highPriority: undefined,
    });
  });

  it('should not format the start or end date if they have not been selected', async () => {
    filterValues.startDate = '';
    filterValues.endDate = '';
    expectedRequest.startDate = undefined;
    expectedRequest.endDate = undefined;

    await runAction(getCustomCaseReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        customCaseReport: {
          filters: filterValues,
          lastIdsOfPages: [{ pk: '', receivedAt: 0 }],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), expectedRequest);
  });
});
