import {
  CustomCaseReportState,
  initialCustomCaseReportState,
} from '../customCaseReportState';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateCustomCaseReportFiltersAction } from './validateCustomCaseReportFiltersAction';

describe('validateCustomCaseReportFiltersAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: mockErrorPath,
    success: mockSuccessPath,
  };
  let customCaseReportState: CustomCaseReportState;
  beforeEach(() => {
    customCaseReportState = initialCustomCaseReportState;
  });

  it('should call the success path when the date range is valid', async () => {
    customCaseReportState.filters.startDate = '01/01/1990';
    customCaseReportState.filters.endDate = '01/01/2000';

    await runAction(validateCustomCaseReportFiltersAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        customCaseReport: customCaseReportState,
      },
    });

    expect(mockSuccessPath).toHaveBeenCalled();
  });

  it('should call the error path when the date range is not in the correct format', async () => {
    customCaseReportState.filters.startDate = 'blooh blah';
    customCaseReportState.filters.endDate = '01/01/2000';
    await runAction(validateCustomCaseReportFiltersAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        customCaseReport: customCaseReportState,
      },
    });

    expect(mockErrorPath).toHaveBeenCalled();
  });
});
