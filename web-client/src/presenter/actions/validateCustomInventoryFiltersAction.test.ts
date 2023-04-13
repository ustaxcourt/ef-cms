import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
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

  it('should call the success path when the date range is valid', async () => {
    applicationContext
      .getUseCases()
      .validateJudgeActivityReportSearchInteractor.mockReturnValue(undefined);

    await runAction(validateCustomInventoryFiltersAction, {
      modules: {
        presenter,
      },
      state: {
        customCaseInventoryFilters: {
          createEndDate: '02/02/2000',
          createStartDate: '01/01/1000',
        },
      },
    });

    expect(mockSuccessPath).toHaveBeenCalled();
  });

  it('should call the error path when the date range is NOT valid', async () => {
    applicationContext
      .getUseCases()
      .validateJudgeActivityReportSearchInteractor.mockReturnValue({
        someProperty: 'Some Property is required.',
      });

    await runAction(validateCustomInventoryFiltersAction, {
      modules: {
        presenter,
      },
      state: {
        customCaseInventoryFilters: {
          createEndDate: 'gobbeltygook',
          createStartDate: undefined,
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalled();
  });
});
