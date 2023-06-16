import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetUserContactEditProgressAction } from './unsetUserContactEditProgressAction';

describe('unsetUserContactEditProgressAction', () => {
  it('should set state.userContactEditProgress to an empty object', async () => {
    const { state } = await runAction(unsetUserContactEditProgressAction, {
      state: {
        userContactEditProgress: {
          information: 'stuff',
        },
      },
    });

    expect(state.userContactEditProgress).toEqual({});
  });
});
