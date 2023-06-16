import { runAction } from '@web-client/presenter/test.cerebral';
import { stopShowValidationAction } from './stopShowValidationAction';

describe('stopShowValidationAction', () => {
  it('sets showValidation to false', async () => {
    const result = await runAction(stopShowValidationAction, {
      state: {
        showValidation: true,
      },
    });

    expect(result.state.showValidation).toEqual(false);
  });
});
