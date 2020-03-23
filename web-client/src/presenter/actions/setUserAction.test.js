import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setUserAction } from './setUserAction';

const setCurrentUserStub = jest.fn().mockReturnValue(null);
const setItemInteractorStub = jest.fn();

describe('setUserAction', () => {
  beforeEach(() => {
    process.env.USTC_ENV = 'dev';

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        setItemInteractor: setItemInteractorStub,
      }),
      setCurrentUser: setCurrentUserStub,
    };
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
    expect(setCurrentUserStub.mock.calls.length).toEqual(1);
    expect(setCurrentUserStub.mock.calls[0][0]).toMatchObject(user);
    expect(setItemInteractorStub.mock.calls.length).toEqual(1);
    expect(setItemInteractorStub.mock.calls[0][0]).toMatchObject({
      key: 'user',
      value: user,
    });
  });
});
