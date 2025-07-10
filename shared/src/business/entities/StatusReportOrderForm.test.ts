import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { StatusReportOrderForm } from '@shared/business/entities/StatusReportOrderForm';
import {
  FORMATS,
  createISODateString,
  getBusinessDateInFuture,
} from '@shared/business/utilities/DateHandler';

describe('StatusReportOrderForm', () => {
  const TOMORROW = getBusinessDateInFuture({
    numberOfDays: 1,
    outputFormat: FORMATS.YYYYMMDD,
    startDate: createISODateString(),
  });

  const VALID_STATUS_REPORT_ORDEER_FORM = {
    additionalOrderText: 'TEST_additionalOrderText',
    docketEntryDescription: 'TEST_docketEntryDescription',
    orderType: STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
    dueDate: TOMORROW,
    issueOrder: STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.allCasesInGroup,
    jurisdiction: STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
    strickenFromTrialSessions: true,
  };

  it('should create a StatusReportOrderForm entity with no validation errors', () => {
    const statusReportOrderForm = new StatusReportOrderForm(
      VALID_STATUS_REPORT_ORDEER_FORM,
    );
    const errors = statusReportOrderForm.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });
});
