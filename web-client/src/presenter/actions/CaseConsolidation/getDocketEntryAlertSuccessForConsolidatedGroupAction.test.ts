import { getDocketEntryAlertSuccessForConsolidatedGroupAction } from './getDocketEntryAlertSuccessForConsolidatedGroupAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocketEntryAlertSuccessForConsolidatedGroupAction', () => {
  it('should return alert object', async () => {
    const { output } = await runAction(
      getDocketEntryAlertSuccessForConsolidatedGroupAction,
      {
        props: {},
        state: {},
      },
    );

    expect(output.alertSuccess).toBeDefined();
  });
});
