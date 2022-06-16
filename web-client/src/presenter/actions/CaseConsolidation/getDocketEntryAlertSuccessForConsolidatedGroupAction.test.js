import { getDocketEntryAlertSuccessForConsolidatedGroupAction } from './getDocketEntryAlertSuccessForConsolidatedGroupAction';
import { runAction } from 'cerebral/test';

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
