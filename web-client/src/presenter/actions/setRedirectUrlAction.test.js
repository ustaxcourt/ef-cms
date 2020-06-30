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

  it('does not unset state.redirectUrl if props.redirectUrl is not set', async () => {
    const result = await runAction(setRedirectUrlAction, {
      props: {
        redirectUrl: null,
      },
      state: {
        redirectUrl: '/example-path',
      },
    });

    expect(result.state.redirectUrl).toEqual('/example-path');
  });
});
