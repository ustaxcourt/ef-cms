import { getDocketEntryAlertSuccessAction } from './getDocketEntryAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getDocketEntryAlertSuccessAction', () => {
  it('should return alert object', async () => {
    const result = runAction(getDocketEntryAlertSuccessAction, {
      props: {},
      state: {},
    });

    expect(result).toBeTruthy();
  });
});
