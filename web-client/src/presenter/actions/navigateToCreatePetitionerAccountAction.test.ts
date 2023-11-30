import { navigateToCreatePetitionerAccountAction } from '@web-client/presenter/actions/navigateToCreatePetitionerAccountAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToCreatePetitionerAccountAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('should call route with the correct url for create petitioner', async () => {
    await runAction(navigateToCreatePetitionerAccountAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/create-account/petitioner');
  });
});
