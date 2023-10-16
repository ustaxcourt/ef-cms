import { navigateToAccountRegistrationAction } from '@web-client/presenter/actions/navigateToAccountRegistrationAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToAccountRegistrationAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('should call route with the correct url for create petitioner', async () => {
    await runAction(navigateToAccountRegistrationAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/create-account/petitioner');
  });
});
