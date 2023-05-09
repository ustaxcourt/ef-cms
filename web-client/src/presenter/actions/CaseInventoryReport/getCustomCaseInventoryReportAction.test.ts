import {
  CUSTOM_CASE_INVENTORY_PAGE_SIZE,
  getCustomCaseInventoryReportAction,
} from './getCustomCaseInventoryReportAction';
import {
  CustomCaseInventoryReportFilters,
  GetCaseInventoryReportRequest,
  GetCaseInventoryReportResponse,
} from '../../../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCustomCaseInventoryReportAction', () => {
  const lastCaseId = 8291;
  let mockCustomCaseReportResponse: GetCaseInventoryReportResponse;

  beforeEach(() => {
    mockCustomCaseReportResponse = {
      foundCases: [],
      lastCaseId,
      totalCount: 0,
    };

    applicationContext
      .getUseCases()
      .getCustomCaseInventoryReportInteractor.mockResolvedValue(
        mockCustomCaseReportResponse,
      );

    presenter.providers.applicationContext = applicationContext;
  });

  const filterValues: CustomCaseInventoryReportFilters = {
    caseStatuses: ['Assigned - Case'],
    caseTypes: ['Deficiency'],
    createEndDate: '05/14/2022',
    createStartDate: '05/10/2022',
    filingMethod: 'electronic',
  };
  const expectedRequest: GetCaseInventoryReportRequest = {
    ...filterValues,
    createEndDate: '2022-05-14T04:00:00.000Z',
    createStartDate: '2022-05-10T04:00:00.000Z',
    pageSize: CUSTOM_CASE_INVENTORY_PAGE_SIZE,
    searchAfter: 0,
  };

  it('should get the custom case inventory report with filter values that the user has selected', async () => {
    const result = await runAction(getCustomCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        customCaseInventory: {
          filters: filterValues,
          lastIdsOfPages: [0],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseInventoryReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), expectedRequest);
    expect(result.state.customCaseInventory.cases).toEqual(
      mockCustomCaseReportResponse.foundCases,
    );
    expect(result.state.customCaseInventory.totalCases).toEqual(
      mockCustomCaseReportResponse.totalCount,
    );
    expect(result.state.customCaseInventory.lastIdsOfPages).toMatchObject([
      0,
      lastCaseId,
    ]);
  });

  it('should populate page ID tracking array when navigating to later pages', async () => {
    const page2SearchId = 9001;
    mockCustomCaseReportResponse = {
      foundCases: [],
      lastCaseId: page2SearchId,
      totalCount: 0,
    };
    applicationContext
      .getUseCases()
      .getCustomCaseInventoryReportInteractor.mockResolvedValue(
        mockCustomCaseReportResponse,
      );
    const page1SearchId = 123;
    expectedRequest.searchAfter = page1SearchId;

    const result = await runAction(getCustomCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 1,
      },
      state: {
        customCaseInventory: {
          filters: filterValues,
          lastIdsOfPages: [0, page1SearchId],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseInventoryReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), expectedRequest);
    expect(result.state.customCaseInventory.cases).toEqual(
      mockCustomCaseReportResponse.foundCases,
    );
    expect(result.state.customCaseInventory.totalCases).toEqual(
      mockCustomCaseReportResponse.totalCount,
    );
    expect(result.state.customCaseInventory.lastIdsOfPages).toMatchObject([
      0,
      page1SearchId,
      page2SearchId,
    ]);
  });
});
