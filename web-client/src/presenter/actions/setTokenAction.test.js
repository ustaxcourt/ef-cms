import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setTokenAction } from './setTokenAction';

describe('setTokenAction,', () => {
  const mockToken = 'abc';
  const mockRefreshToken = '123';

  presenter.providers.applicationContext = applicationContext;

  it('should set state.token and state.refresh token from props', async () => {
    const { state } = await runAction(setTokenAction, {
      modules: {
        presenter,
      },
      props: {
        refreshToken: mockRefreshToken,
        token: mockToken,
      },
      state: {},
    });

    expect(state.token).toEqual(mockToken);
    expect(state.refreshToken).toEqual(mockRefreshToken);
  });

  it('should set state.refresh token to null when props.refreshToken is undefined', async () => {
    const { state } = await runAction(setTokenAction, {
      modules: {
        presenter,
      },
      props: {
        refreshToken: undefined,
      },
      state: {},
    });

    expect(state.refreshToken).toEqual(null);
  });

  it('should call applicationContext.setCurrentUserToken with props.token', async () => {
    await runAction(setTokenAction, {
      modules: {
        presenter,
      },
      props: {
        refreshToken: mockRefreshToken,
        token: mockToken,
      },
      state: {},
    });

    expect(applicationContext.setCurrentUserToken.mock.calls[0][0]).toEqual(
      mockToken,
    );
  });

  it('should call applicationContext.getUseCases().setItemInteractor with key token and the value of props.token', async () => {
    await runAction(setTokenAction, {
      modules: {
        presenter,
      },
      props: {
        refreshToken: mockRefreshToken,
        token: mockToken,
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().setItemInteractor.mock.calls[0][1],
    ).toMatchObject({
      key: 'token',
      value: mockToken,
    });
  });
});
