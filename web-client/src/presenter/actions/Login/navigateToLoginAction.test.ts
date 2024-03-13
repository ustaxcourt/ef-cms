import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToForgotPasswordAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to Messages', async () => {
    await runAction(navigateToLoginAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/login');
  });
});
