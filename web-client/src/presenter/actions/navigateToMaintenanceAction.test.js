import { navigateToMaintenanceAction } from './navigateToMaintenanceAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToMaintenanceAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to maintenance page', async () => {
    await runAction(navigateToMaintenanceAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/maintenance');
  });
});
