jest.mock('@shared/proxies/reports/getCustomCaseReportProxy');
import {
  CHIEF_JUDGE,
  CUSTOM_CASE_REPORT_PAGE_SIZE,
} from '@shared/business/entities/EntityConstants';
import {
  CustomCaseReportFilters,
  GetCustomCaseReportRequest,
  GetCustomCaseReportResponse,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { getCustomCaseReportAction } from './getCustomCaseReportAction';
import { getCustomCaseReportInteractor as getCustomCaseReportInteractorMock } from '@shared/proxies/reports/getCustomCaseReportProxy';
import { judgeUser } from '@shared/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCustomCaseReportAction', () => {
  const getCustomCaseReportInteractor = jest.mocked(
    getCustomCaseReportInteractorMock,
  );
  let mockCustomCaseReportResponse: GetCustomCaseReportResponse;
  let filterValues: CustomCaseReportFilters;
  let expectedRequest: GetCustomCaseReportRequest;

  beforeEach(() => {
    mockCustomCaseReportResponse = {
      foundCases: [],
      totalCount: 0,
    };

    getCustomCaseReportInteractor.mockResolvedValue(
      mockCustomCaseReportResponse,
    );

    filterValues = {
      caseStatuses: ['Assigned - Case'],
      caseTypes: ['Deficiency'],
      endDate: '05/14/2022',
      filingMethod: 'electronic',
      highPriority: true,
      judges: [CHIEF_JUDGE],
      preferredTrialCities: ['Jackson, Mississippi'],
      procedureType: 'All',
      startDate: '05/10/2022',
    };

    expectedRequest = {
      ...filterValues,
      endDate: '2022-05-15T03:59:59.999Z',
      pageSize: CUSTOM_CASE_REPORT_PAGE_SIZE,
      startDate: '2022-05-10T04:00:00.000Z',
      page: 0,
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
        },
      },
    });

    expect(getCustomCaseReportInteractor).toHaveBeenCalledWith(expectedRequest);
    expect(result.state.customCaseReport.cases).toEqual(
      mockCustomCaseReportResponse.foundCases,
    );
    expect(result.state.customCaseReport.totalCases).toEqual(
      mockCustomCaseReportResponse.totalCount,
    );
  });

  it('should paginate properly', async () => {
    mockCustomCaseReportResponse = {
      foundCases: [],
      totalCount: 0,
    };
    getCustomCaseReportInteractor.mockResolvedValue(
      mockCustomCaseReportResponse,
    );
    const expectedRequestWithSearchAfter = {
      ...expectedRequest,
      page: 1,
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
        },
      },
    });

    expect(getCustomCaseReportInteractor).toHaveBeenCalledWith(
      expectedRequestWithSearchAfter,
    );
    expect(result.state.customCaseReport.cases).toEqual(
      mockCustomCaseReportResponse.foundCases,
    );
    expect(result.state.customCaseReport.totalCases).toEqual(
      mockCustomCaseReportResponse.totalCount,
    );
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
        },
      },
    });

    expect(getCustomCaseReportInteractor).toHaveBeenCalledWith({
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
        },
      },
    });

    expect(getCustomCaseReportInteractor).toHaveBeenCalledWith(expectedRequest);
  });

  it('should get the custom case report with judges ids if judges names have been selected', async () => {
    const judgeSotomayor = judgeUser;
    const judgeColvin = {
      ...judgeUser,
      name: 'Colvin',
      userId: '13b00e5f-b78c-476c-820e-5d6ed1d45678',
    };

    filterValues.judges = [judgeColvin.name, judgeSotomayor.name, CHIEF_JUDGE];
    expectedRequest.judges = [
      judgeColvin.userId,
      judgeSotomayor.userId,
      CHIEF_JUDGE,
    ];

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
        },
        judges: [judgeSotomayor, judgeColvin],
      },
    });

    expect(getCustomCaseReportInteractor).toHaveBeenCalledWith(expectedRequest);
  });
});
