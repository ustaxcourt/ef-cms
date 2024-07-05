import { runAction } from '@web-client/presenter/test.cerebral';
import { setEditStatusReportOrderResponseFormAction } from './setEditStatusReportOrderResponseFormAction';

describe('setEditStatusReportOrderResponseFormAction,', () => {
  it('sets the form state from docketToEdit and create url based on case docket number and docketEntryIdToEdit', async () => {
    const result = await runAction(setEditStatusReportOrderResponseFormAction, {
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
            jurisdiction: 'retained',
            orderType: 'statusReport',
            strickenFromTrialSessions: 'true',
          },
        },
      },
    });

    expect(result.state.form).toEqual({
      additionalOrderText: 'Test',
      docketEntryDescription: 'Order',
      dueDate: '07/04/2024',
      jurisdiction: 'retained',
      orderType: 'statusReport',
      strickenFromTrialSessions: 'true',
    });
    expect(result.output).toEqual({
      path: '/case-detail/1/documents/107-19/order-response-edit',
    });
  });
});
