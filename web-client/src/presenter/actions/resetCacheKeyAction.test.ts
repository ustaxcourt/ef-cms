import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { resetCacheKeyAction } from './resetCacheKeyAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetCacheKeyAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set a new cache key every call', async () => {
    let { state } = await runAction(resetCacheKeyAction, {
      modules: { presenter },
      state: {
        messageCacheKey: '',
      },
    });
    const lastCacheKey = state.messageCacheKey;
    expect(lastCacheKey).toBeDefined();
    const { state: newState } = await runAction(resetCacheKeyAction, {
      modules: { presenter },
      state: {
        messageCacheKey: '',
      },
    });

    expect(lastCacheKey).not.toEqual(newState);
  });
});
