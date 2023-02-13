import { clearErrorAlertsAction } from './clearErrorAlertsAction';
import { runAction } from 'cerebral/test';

describe('clearErrorAlertsAction', () => {
  it('should clear state.alertError', async () => {
    const { state } = await runAction(clearErrorAlertsAction, {
      state: { alertError: { message: 'This is a bad error' } },
    });

    expect(state.alertError).toBeUndefined();
  });
});
