import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { receiveRefreshTokenAction } from './receiveRefreshTokenAction';
import { runAction } from 'cerebral/test';

describe('receiveRefreshTokenAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the refresh token action in state', async () => {
    const expectedRefreshToken = 'someThing';
    const result = await runAction(receiveRefreshTokenAction, {
      modules: {
        presenter,
      },
      props: {
        refreshToken: expectedRefreshToken,
      },
      state: {
        refreshToken: 'old-value',
      },
    });
    expect(result.state.refreshToken).toBe(expectedRefreshToken);
  });
});
