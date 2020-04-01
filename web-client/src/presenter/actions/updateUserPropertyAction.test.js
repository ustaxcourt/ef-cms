import { runAction } from 'cerebral/test';
import { updateUserPropertyAction } from './updateUserPropertyAction';

describe('updateUserPropertyAction', () => {
  it('updates user property', async () => {
    const result = await runAction(updateUserPropertyAction, {
      props: {
        key: 'city',
        value: 'flavortown',
      },
      state: {
        user: {},
      },
    });

    expect(result.state.user.city).toEqual('flavortown');
  });
});
