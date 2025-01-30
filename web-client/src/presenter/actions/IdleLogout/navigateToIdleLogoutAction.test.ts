import { navigateToIdleLogoutAction } from './navigateToIdleLogoutAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const mockRoute = jest.fn();
describe('navigateToIdleLogoutAction', () => {
  beforeAll(() => {
    presenter.providers.router = {
      route: mockRoute,
    };
  });

  it('calls history.back()', async () => {
    await runAction(navigateToIdleLogoutAction, {
      modules: {
        presenter,
      },
    });
    expect(mockRoute).toHaveBeenCalledWith('/idle-logout');
  });
});
