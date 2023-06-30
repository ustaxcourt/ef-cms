import { runAction } from '@web-client/presenter/test.cerebral';
import { startShowValidationAction } from './startShowValidationAction';

describe('startShowValidationAction', () => {
  it('sets showValidation to true', async () => {
    const result = await runAction(startShowValidationAction, {
      state: {
        showValidation: false,
      },
    });

    expect(result.state.showValidation).toEqual(true);
  });
});
