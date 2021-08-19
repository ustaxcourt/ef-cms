import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setUserAction } from './setUserAction';

describe('setUserAction', () => {
  beforeAll(() => {
    process.env.USTC_ENV = 'dev';

    presenter.providers.applicationContext = applicationContext;
  });

  afterEach(() => {
    delete process.env.USTC_ENV;
    delete global.window;
  });

  it('stores the user onto local storage when running local', async () => {
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
    expect(
      applicationContext.getUseCases().setItemInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().setItemInteractor.mock.calls[0][1],
    ).toMatchObject({
      key: 'user',
      value: user,
    });
  });
});
