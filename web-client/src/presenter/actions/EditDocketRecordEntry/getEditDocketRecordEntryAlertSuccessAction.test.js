import { getEditDocketRecordEntryAlertSuccessAction } from './getEditDocketRecordEntryAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getEditDocketRecordEntryAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getEditDocketRecordEntryAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
