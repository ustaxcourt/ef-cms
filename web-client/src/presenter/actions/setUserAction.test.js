import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setUserAction } from './setUserAction';
import sinon from 'sinon';

const setCurrentUserStub = sinon.stub().returns(null);

presenter.providers.applicationContext = {
  getUseCases: () => ({
    setItemInteractor: ({ key, value }) => {
      return window.localStorage.setItem(key, JSON.stringify(value));
    },
  }),
  setCurrentUser: setCurrentUserStub,
};

describe('setUserAction', () => {
  beforeEach(() => {
    process.env.USTC_ENV = 'dev';
    global.window = {
      localStorage: {
        setItem() {},
      },
    };
    sinon.stub(window.localStorage, 'setItem');
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
    expect(setCurrentUserStub.getCall(0).args[0]).toMatchObject(user);
    expect(setCurrentUserStub.calledOnce).toEqual(true);
    expect(window.localStorage.setItem.getCall(0).args[0]).toEqual('user');
    expect(window.localStorage.setItem.getCall(0).args[1]).toEqual(
      JSON.stringify(user),
    );
  });
});
