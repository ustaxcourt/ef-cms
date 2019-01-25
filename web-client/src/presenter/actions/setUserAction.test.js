import { runAction } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';
import setUserAction from './setUserAction';

const setCurrentUserStub = sinon.stub().returns(null);

presenter.providers.applicationContext = {
  setCurrentUser: setCurrentUserStub,
};

describe('setUserAction', async () => {
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
      userId: 'taxpayer',
    };
    await runAction(setUserAction, {
      state: {},
      modules: {
        presenter,
      },
      props: {
        user,
      },
    });
    expect(setCurrentUserStub.getCall(0).args[0]).toMatchObject(user);
    expect(setCurrentUserStub.calledOnce).toEqual(true);
    expect(window.localStorage.setItem.getCall(0).args[0]).toEqual('user');
    expect(window.localStorage.setItem.getCall(0).args[1]).toEqual(
      JSON.stringify(user),
    );
  });
});
