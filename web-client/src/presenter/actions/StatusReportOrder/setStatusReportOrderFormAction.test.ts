import { runAction } from '@web-client/presenter/test.cerebral';
import { setStatusReportOrderFormAction } from './setStatusReportOrderFormAction';

describe('setStatusReportOrderFormAction,', () => {
  it('sets the statusReportOrderR state from props', async () => {
    const result = await runAction(setStatusReportOrderFormAction, {
      props: {
        statusReportFilingDate: '2024-07-04',
        statusReportIndex: 4,
      },
      state: {},
    });

    expect(result.state.statusReportOrder.statusReportFilingDate).toEqual(
      '2024-07-04',
    );
    expect(result.state.statusReportOrder.statusReportIndex).toEqual(4);
  });

  it('sets the statusReportOrder state from documentToEdit', async () => {
    const result = await runAction(setStatusReportOrderFormAction, {
      state: {
        documentToEdit: {
          draftOrderState: {
            statusReportFilingDate: '2024-07-04',
            statusReportIndex: 4,
          },
        },
      },
    });

    expect(result.state.statusReportOrder.statusReportFilingDate).toEqual(
      '2024-07-04',
    );
    expect(result.state.statusReportOrder.statusReportIndex).toEqual(4);
  });
});
