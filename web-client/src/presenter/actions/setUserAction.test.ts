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

  it('stores the user cerebral state', async () => {
    const user = {
      userId: 'petitioner',
    };
    const { state } = await runAction(setUserAction, {
      modules: {
        presenter,
      },
      props: {
        user,
      },
      state: {},
    });
    expect(state.user).toEqual(user);
  });
});
