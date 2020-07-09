import { navigateToCaseMessagesAction } from './navigateToCaseMessagesAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToCaseMessagesAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to case messages', async () => {
    await runAction(navigateToCaseMessagesAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/case-messages/my/inbox');
  });
});
