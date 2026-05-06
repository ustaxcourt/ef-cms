import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetRedirectUrlAction } from './unsetRedirectURLAction';

describe('unsetRedirectUrlAction,', () => {
  it('should unset redirect URL', async () => {
    const result = await runAction(unsetRedirectUrlAction, {
      state: { redirectUrl: 'url' },
    });

    expect(result.state.redirectUrl).toBeUndefined();
  });
});
