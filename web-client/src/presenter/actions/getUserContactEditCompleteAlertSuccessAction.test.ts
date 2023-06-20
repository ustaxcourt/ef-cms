import { getUserContactEditCompleteAlertSuccessAction } from './getUserContactEditCompleteAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getUserContactEditCompleteAlertSuccessAction', () => {
  it('should return a success message', async () => {
    const { output } = await runAction(
      getUserContactEditCompleteAlertSuccessAction,
      {},
    );

    expect(output.alertSuccess.message).toBe('Changes saved.');
  });
});
