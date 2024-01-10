import { presenter } from '../presenter-mock';
import { redirectToCreatePetitionerAccountAction } from '@web-client/presenter/actions/redirectToCreatePetitionerAccountAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('redirectToCreatePetitionerAccountAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('should call route with the correct url for create petitioner', async () => {
    await runAction(redirectToCreatePetitionerAccountAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/create-account/petitioner');
  });
});
