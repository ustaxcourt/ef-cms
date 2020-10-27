import { getUserContactEditCompleteAlertSuccessAction } from './getUserContactEditCompleteAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getUserContactEditCompleteAlertSuccessAction', () => {
  it('should return a success message', async () => {
    const { output } = await runAction(
      getUserContactEditCompleteAlertSuccessAction,
      {},
    );

    expect(output.alertSuccess.message).toBe('Changes saved.');
  });
});
