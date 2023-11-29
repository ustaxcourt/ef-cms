import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setUserAction } from './setUserAction';

describe('setUserAction', () => {
  beforeEach(() => {
    process.env.USTC_ENV = 'dev';
    presenter.providers.applicationContext = applicationContext;
  });

  afterEach(() => {
    delete process.env.USTC_ENV;
    delete global.window;
  });

  it('stores the user onto the application context', async () => {
    const user = {
      userId: 'petitioner',
    };
    await runAction(setUserAction, {
      modules: {
        presenter,
      },
      props: {
        user,
      },
      state: {},
    });
    expect(applicationContext.setCurrentUser.mock.calls.length).toEqual(1);
    expect(applicationContext.setCurrentUser.mock.calls[0][0]).toMatchObject(
      user,
    );
  });

  it('should not update state if there is no user provided in props', async () => {
    const user = {
      userId: 'petitioner',
    };

    const results = await runAction(setUserAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        user,
      },
    });

    expect(results.state.user).toEqual(user);
    expect(applicationContext.setCurrentUser.mock.calls.length).toEqual(0);
  });
});
