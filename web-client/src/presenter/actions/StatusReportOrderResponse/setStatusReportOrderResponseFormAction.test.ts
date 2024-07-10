import { runAction } from '@web-client/presenter/test.cerebral';
import { setStatusReportOrderResponsePath } from './setStatusReportOrderResponsePath';

describe('setStatusReportOrderResponseFormAction,', () => {
  it('sets the statusReportOrderResponse state from props', async () => {
    const result = await runAction(setStatusReportOrderResponsePath, {
      props: {
        statusReportFilingDate: '2024-07-04',
        statusReportIndex: 4,
      },
      state: {},
    });

    expect(
      result.state.statusReportOrderResponse.statusReportFilingDate,
    ).toEqual('2024-07-04');
    expect(result.state.statusReportOrderResponse.statusReportIndex).toEqual(4);
  });
});
