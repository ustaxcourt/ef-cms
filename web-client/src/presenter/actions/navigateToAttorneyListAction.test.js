import { navigateToAttorneyListAction } from './navigateToAttorneyListAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('navigateToAttorneyListAction', () => {
  let routeStub;

  beforeEach(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to Attorney List', async () => {
    await runAction(navigateToAttorneyListAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/users/attorney-list');
  });
});
