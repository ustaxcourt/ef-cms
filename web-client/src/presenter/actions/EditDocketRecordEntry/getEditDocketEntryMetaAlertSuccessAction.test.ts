import { getEditDocketEntryMetaAlertSuccessAction } from './getEditDocketEntryMetaAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getEditDocketEntryMetaAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getEditDocketEntryMetaAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
