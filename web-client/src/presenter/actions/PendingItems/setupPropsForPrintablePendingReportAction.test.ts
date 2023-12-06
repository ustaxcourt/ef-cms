import { runAction } from '@web-client/presenter/test.cerebral';
import { setupPropsForPrintablePendingReportAction } from './setupPropsForPrintablePendingReportAction';

describe('setupPropsForPrintablePendingReportAction', () => {
  it('should update the props with docketNumber if docketNumberFilter is true', async () => {
    const result = await runAction(setupPropsForPrintablePendingReportAction, {
      props: {
        caseDetail: { docketNumber: '123-45' },
        docketNumberFilter: true,
      },
      state: {},
    });

    expect(result.output.docketNumberFilter).toEqual('123-45');
  });
});
