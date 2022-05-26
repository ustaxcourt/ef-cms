import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { resetCacheKeyAction } from './resetCacheKeyAction';
import { runAction } from 'cerebral/test';

describe('resetCacheKeyAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set a new cache key every call', async () => {
    const { state } = await runAction(resetCacheKeyAction, {
      modules: { presenter },
      state: {
        messageCacheKey: '',
      },
    });
    expect(state.messageCacheKey).toBeDefined();
  });
});
