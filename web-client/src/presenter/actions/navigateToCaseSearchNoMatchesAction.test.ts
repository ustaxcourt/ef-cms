import { navigateToCaseSearchNoMatchesAction } from './navigateToCaseSearchNoMatchesAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToCaseSearchNoMatchesAction', () => {
  let routeMock;

  beforeAll(() => {
    routeMock = jest.fn();
    presenter.providers.router = {
      route: routeMock,
    };
  });

  it('should call the router to navigate to /search/no-matches', async () => {
    await runAction(navigateToCaseSearchNoMatchesAction, {
      modules: {
        presenter,
      },
    });

    expect(routeMock).toHaveBeenCalledWith('/search/no-matches');
  });
});
