import {
  CustomCaseInventoryReportState,
  initialCustomCaseInventoryReportState,
} from '../customCaseInventoryReportState';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateCustomInventoryFiltersAction } from './validateCustomInventoryFiltersAction';

describe('validateCustomInventoryFiltersAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: mockErrorPath,
    success: mockSuccessPath,
  };
  let customCaseInventoryState: CustomCaseInventoryReportState;
  beforeEach(() => {
    customCaseInventoryState = initialCustomCaseInventoryReportState;
  });

  it('should call the success path when the date range is valid', async () => {
    customCaseInventoryState.filters.createStartDate = '01/01/1990';
    customCaseInventoryState.filters.createEndDate = '01/01/2000';

    await runAction(validateCustomInventoryFiltersAction, {
      modules: {
        presenter,
      },
      state: {
        customCaseInventory: customCaseInventoryState,
      },
    });

    expect(mockSuccessPath).toHaveBeenCalled();
  });

  it('should call the error path when the date range is not in the correct format', async () => {
    customCaseInventoryState.filters.createStartDate = 'blooh blah';
    customCaseInventoryState.filters.createEndDate = '01/01/2000';
    await runAction(validateCustomInventoryFiltersAction, {
      modules: {
        presenter,
      },
      state: {
        customCaseInventory: customCaseInventoryState,
      },
    });

    expect(mockErrorPath).toHaveBeenCalled();
  });
});
