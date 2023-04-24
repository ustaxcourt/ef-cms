import {
  CUSTOM_CASE_INVENTORY_PAGE_SIZE,
  getCustomCaseInventoryReportAction,
} from './getCustomCaseInventoryReportAction';
import { GetCaseInventoryReportRequest } from '../../../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCustomCaseInventoryReportAction', () => {
  const mockCustomCaseReportResponse = {
    foundCases: [],
    totalCount: 0,
  };

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getCustomCaseInventoryReportInteractor.mockResolvedValue(
        mockCustomCaseReportResponse,
      );

    presenter.providers.applicationContext = applicationContext;
  });

  it('should get the custom case inventory report with filter values that the user has selected', async () => {
    const expectedRequest: GetCaseInventoryReportRequest = {
      caseStatuses: ['Assigned - Case'],
      caseTypes: ['Deficiency'],
      createEndDate: '2022-05-01T17:21:05.483Z',
      createStartDate: '2022-01-01T17:21:05.483Z',
      filingMethod: 'electronic',
      pageNumber: 0,
      pageSize: CUSTOM_CASE_INVENTORY_PAGE_SIZE,
    };
    const filterValues = {
      caseStatuses: expectedRequest.caseStatuses,
      caseTypes: expectedRequest.caseTypes,
      createEndDate: expectedRequest.createEndDate,
      createStartDate: expectedRequest.createStartDate,
      filingMethod: expectedRequest.filingMethod,
    };

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
  });
});
