import { STATUS_REPORT_ORDER_RESPONSE_OPTIONS } from '@shared/business/entities/EntityConstants';
import { clearStatusReportOrderResponseFormAction } from './clearStatusReportOrderResponseFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearStatusReportOrderResponseFormAction,', () => {
  it("should clear form state if there's no document to edit", async () => {
    const result = await runAction(clearStatusReportOrderResponseFormAction, {
      state: {
        form: {
          additionalOrderText: 'Test',
          docketEntryDescription: 'Order Test',
          dueDate: '07/04/2024',
          issueOrder:
            STATUS_REPORT_ORDER_RESPONSE_OPTIONS.issueOrderOptions
              .allCasesInGroup,
          jurisdiction:
            STATUS_REPORT_ORDER_RESPONSE_OPTIONS.jurisdictionOptions.retained,
          orderType:
            STATUS_REPORT_ORDER_RESPONSE_OPTIONS.orderTypeOptions.statusReport,
          strickenFromTrialSessions: 'true',
        },
      },
    });

    expect(result.state.form).toEqual({
      additionalOrderText: '',
      docketEntryDescription: 'Order',
      issueOrder:
        STATUS_REPORT_ORDER_RESPONSE_OPTIONS.issueOrderOptions.allCasesInGroup,
    });
  });

  it("should not clear form state if there's a document to edit", async () => {
    const result = await runAction(clearStatusReportOrderResponseFormAction, {
      state: {
        documentToEdit: 'stuff',
        form: {
          additionalOrderText: 'Test',
          docketEntryDescription: 'Order Test',
          dueDate: '07/04/2024',
          issueOrder:
            STATUS_REPORT_ORDER_RESPONSE_OPTIONS.issueOrderOptions
              .allCasesInGroup,
          jurisdiction:
            STATUS_REPORT_ORDER_RESPONSE_OPTIONS.jurisdictionOptions.retained,
          orderType:
            STATUS_REPORT_ORDER_RESPONSE_OPTIONS.orderTypeOptions.statusReport,
          strickenFromTrialSessions: 'true',
        },
      },
    });

    expect(result.state.form).toEqual({
      additionalOrderText: 'Test',
      docketEntryDescription: 'Order Test',
      dueDate: '07/04/2024',
      issueOrder:
        STATUS_REPORT_ORDER_RESPONSE_OPTIONS.issueOrderOptions.allCasesInGroup,
      jurisdiction:
        STATUS_REPORT_ORDER_RESPONSE_OPTIONS.jurisdictionOptions.retained,
      orderType:
        STATUS_REPORT_ORDER_RESPONSE_OPTIONS.orderTypeOptions.statusReport,
      strickenFromTrialSessions: 'true',
    });
    expect(result.state.documentToEdit).toEqual('stuff');
  });
});
