import { navigateToMessagesAction } from './navigateToMessagesAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToMessagesAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to Messages', async () => {
    await runAction(navigateToMessagesAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/messages/my/inbox');
  });
});
