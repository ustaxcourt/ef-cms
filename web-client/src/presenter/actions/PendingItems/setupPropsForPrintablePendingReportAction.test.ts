import { runAction } from '@web-client/presenter/test.cerebral';
import { setupPropsForPrintablePendingReportAction } from './setupPropsForPrintablePendingReportAction';

describe('setupPropsForPrintablePendingReportAction', () => {
  it('should update the props with docketNumber if docketNumberFilter is true', async () => {
    const result = await runAction<{ docketNumberFilter: string }>(setupPropsForPrintablePendingReportAction, {
      props: {
        docketNumberFilter: true,
      },
      state: {
        caseDetail: { docketNumber: '123-45' },
      },
    });

    const output = result.output as { docketNumberFilter: string };
    expect(output.docketNumberFilter).toEqual('123-45');
  });
});
