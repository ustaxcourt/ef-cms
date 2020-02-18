import { getEditDocketEntryMetaAlertSuccessAction } from './getEditDocketEntryMetaAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getEditDocketEntryMetaAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getEditDocketEntryMetaAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
