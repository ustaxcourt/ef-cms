import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setEditStatusReportOrderFormAction } from './setEditStatusReportOrderFormAction';

describe('setEditStatusReportOrderFormAction,', () => {
  it('sets the form state from docketToEdit and create url based on case docket number and docketEntryIdToEdit', async () => {
    const result = await runAction(setEditStatusReportOrderFormAction, {
      props: {
        caseDetail: {
          docketNumber: '1',
        },
        docketEntryIdToEdit: '107-19',
      },
      state: {
        documentToEdit: {
          draftOrderState: {
            additionalOrderText: 'Test',
            docketEntryDescription: 'Order',
            dueDate: '07/04/2024',
            jurisdiction:
              STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
            orderType:
              STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
            strickenFromTrialSessions: 'true',
          },
        },
      },
    });

    expect(result.state.form).toEqual({
      additionalOrderText: 'Test',
      docketEntryDescription: 'Order',
      dueDate: '07/04/2024',
      jurisdiction: STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
      orderType: STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
      strickenFromTrialSessions: 'true',
    });
    expect(result.output).toEqual({
      path: '/case-detail/1/documents/107-19/status-report-order-edit',
    });
  });
});
