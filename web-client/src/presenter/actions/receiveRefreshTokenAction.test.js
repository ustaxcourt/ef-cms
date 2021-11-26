import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { receiveRefreshTokenAction } from './receiveRefreshTokenAction';
import { runAction } from 'cerebral/test';

describe('receiveRefreshTokenAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the refresh token action in state', async () => {
    const result = await runAction(receiveRefreshTokenAction, {
      modules: {
        presenter,
      },
      props: {
        refreshToken: 'someThing',
      },
      state: {
        refreshToken: undefined,
      },
    });
    expect(result.state.refreshToken).toBe('someThing');
  });

  it('should NOT set the refresh token action in state if environment IS_LOCAL', async () => {
    const isLocal = process.env.IS_LOCAL;
    process.env.IS_LOCAL = true;
    const result = await runAction(receiveRefreshTokenAction, {
      modules: {
        presenter,
      },
      props: {
        refreshToken: 'someThing',
      },
      state: {
        refreshToken: undefined,
      },
    });
    process.env.IS_LOCAL = isLocal;
    expect(result.state.refreshToken).not.toBeDefined();
  });
});
