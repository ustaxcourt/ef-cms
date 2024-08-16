import { checkClientNeedsToRefresh } from '@web-client/presenter/actions/checkClientNeedsToRefresh';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('checkClientNeedsToRefresh', () => {
  let pathClientNeedsToRefresh;
  let pathClientDoesNotNeedToRefresh;

  beforeEach(() => {
    pathClientNeedsToRefresh = jest.fn();
    pathClientDoesNotNeedToRefresh = jest.fn();

    presenter.providers.path = {
      clientDoesNotNeedToRefresh: pathClientDoesNotNeedToRefresh,
      clientNeedsToRefresh: pathClientNeedsToRefresh,
    };
  });

  it('properly handles the case when clientNeedsToRefresh is false', async () => {
    await runAction(checkClientNeedsToRefresh, {
      modules: {
        presenter,
      },
      state: {
        clientNeedsToRefresh: false,
      },
    });

    expect(pathClientDoesNotNeedToRefresh).toHaveBeenCalled();
  });

  it('properly handles the case when clientNeedsToRefresh is true', async () => {
    await runAction(checkClientNeedsToRefresh, {
      modules: {
        presenter,
      },
      state: {
        clientNeedsToRefresh: true,
      },
    });

    expect(pathClientNeedsToRefresh).toHaveBeenCalled();
  });
});
