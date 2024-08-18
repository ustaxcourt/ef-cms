import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateStatusReportOrderFormAction } from './validateStatusReportOrderFormAction';

describe('validateStatusReportOrderFormAction,', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  presenter.providers.path = {
    error: mockErrorPath,
    success: mockSuccessPath,
  };

  presenter.providers.applicationContext = applicationContext;

  it('should validate successfully when no errors', async () => {
    const today = formatNow(FORMATS.YYYYMMDD);

    await runAction(validateStatusReportOrderFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          additionalOrderText: 'Test',
          docketEntryDescription: 'Order',
          dueDate: today,
          issueOrder:
            STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.justThisCase,
          jurisdiction:
            STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
          orderType: STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
          strickenFromTrialSessions: 'true',
        },
      },
    });

    expect(mockSuccessPath).toHaveBeenCalled();
  });

  it('should validate with error when missing docket entry description, invalid due date, and missing jurisdiction', async () => {
    await runAction(validateStatusReportOrderFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          additionalOrderText: 'Test',
          dueDate: 'bb-bb-bbbb',
          issueOrder:
            STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.justThisCase,
          orderType: STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
          strickenFromTrialSessions: 'true',
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: {
        docketEntryDescription: 'Enter a docket entry description',
        dueDate: 'Enter a valid date',
        jurisdiction:
          'Jurisdiction is required since case is stricken from the trial session',
      },
    });
  });

  it('should validate with error when due date is past', async () => {
    await runAction(validateStatusReportOrderFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          additionalOrderText: 'Test',
          docketEntryDescription: 'Order',
          dueDate: '2024-07-03',
          issueOrder:
            STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.justThisCase,
          jurisdiction:
            STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
          orderType: STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
          strickenFromTrialSessions: 'true',
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: {
        dueDate: 'Due date cannot be prior to today. Enter a valid date.',
      },
    });
  });
});
