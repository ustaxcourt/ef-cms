import { followRedirectAction } from './followRedirectAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('followRedirectAction', () => {
  presenter.providers.path = {
    default: jest.fn(),
    success: jest.fn(),
  };

  presenter.providers.router = {
    route: jest.fn(),
  };

  it('routes to the given state.redirectUrl, calling the success path and clearing the redirectUrl from state', async () => {
    const result = await runAction(followRedirectAction, {
      modules: {
        presenter,
      },
      state: {
        redirectUrl: '/example-path',
      },
    });

    expect(presenter.providers.path.success).toHaveBeenCalled();
    expect(presenter.providers.router.route).toHaveBeenCalledWith(
      '/example-path',
    );
    expect(result.state.redirectUrl).toBeUndefined();
  });

  it('calls the default path if no redirectUrl', async () => {
    await runAction(followRedirectAction, {
      modules: {
        presenter,
      },
      state: {
        redirectUrl: null,
      },
    });

    expect(presenter.providers.path.default).toHaveBeenCalled();
    expect(presenter.providers.router.route).not.toHaveBeenCalled();
  });
});
