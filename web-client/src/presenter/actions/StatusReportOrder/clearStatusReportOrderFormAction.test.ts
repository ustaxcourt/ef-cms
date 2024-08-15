import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { clearStatusReportOrderFormAction } from './clearStatusReportOrderFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearStatusReportOrderFormAction,', () => {
  it('should clear form state', async () => {
    const result = await runAction(clearStatusReportOrderFormAction, {
      state: {
        form: {
          additionalOrderText: 'Test',
          docketEntryDescription: 'Order Test',
          dueDate: '07/04/2024',
          issueOrder:
            STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.allCasesInGroup,
          jurisdiction:
            STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
          orderType: STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
          strickenFromTrialSessions: 'true',
        },
      },
    });

    expect(result.state.form).toEqual({
      additionalOrderText: '',
      docketEntryDescription: 'Order',
      issueOrder: STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.allCasesInGroup,
    });
  });
});
