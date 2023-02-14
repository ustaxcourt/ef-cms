import { runAction } from 'cerebral/test';
import { setRedirectUrlAction } from './setRedirectUrlAction';

describe('setRedirectUrlAction', () => {
  it('sets state.redirectUrl from props', async () => {
    const result = await runAction(setRedirectUrlAction, {
      props: {
        redirectUrl: '/example-path',
      },
      state: {
        redirectUrl: null,
      },
    });

    expect(result.state.redirectUrl).toEqual('/example-path');
  });
});
