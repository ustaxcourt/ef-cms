import { GetCaseInventoryReportRequest } from '../../../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCustomCaseInventoryReportAction } from './getCustomCaseInventoryReportAction';
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
    const filterValues: GetCaseInventoryReportRequest = {
      caseStatuses: ['Assigned - Case'],
      caseTypes: ['Deficiency'],
      createEndDate: '2022-05-01T17:21:05.483Z',
      createStartDate: '2022-01-01T17:21:05.483Z',
      filingMethod: 'electronic',
    };
    const result = await runAction(getCustomCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      state: {
        customCaseInventoryFilters: filterValues,
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseInventoryReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), filterValues);
    expect(result.state.customCaseInventoryReportData).toEqual(
      mockCustomCaseReportResponse,
    );
  });
});
