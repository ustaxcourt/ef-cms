import { navigateToDashboardAction } from './navigateToDashboardAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToDashboardAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to Dashboard', async () => {
    await runAction(navigateToDashboardAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/');
  });
});
