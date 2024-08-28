import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCurrentUserToken } from '@shared/proxies/requests';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTokenAction } from './setTokenAction';

describe('setTokenAction,', () => {
  const mockToken = 'f0c63793-3aab-4023-9f9c-1fffbcd7f102';

  presenter.providers.applicationContext = applicationContext;

  it('should set state.token from props', async () => {
    const { state } = await runAction(setTokenAction, {
      modules: {
        presenter,
      },
      props: {
        idToken: mockToken,
      },
      state: {
        token: undefined,
      },
    });

    expect(state.token).toEqual(mockToken);
  });

  it('should setCurrentUserToken with props.token', async () => {
    await runAction(setTokenAction, {
      modules: {
        presenter,
      },
      props: {
        idToken: mockToken,
      },
      state: {},
    });

    expect(getCurrentUserToken()).toEqual(mockToken);
  });
});
