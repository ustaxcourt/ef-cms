import { isLoggedInAction } from './isLoggedInAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

const isLoggedInStub = sinon.stub();
const unauthorizedStub = sinon.stub();

presenter.providers.path = {
  isLoggedIn: isLoggedInStub,
  unauthorized: unauthorizedStub,
};

presenter.providers.router = {
  route: () => {},
};

presenter.providers.applicationContext = {};

describe('isLoggedInAction', () => {
  it('should call path.isLoggedIn if currentUser is defined', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      email: 'petitioner1@example.com',
    });

    await runAction(isLoggedInAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(isLoggedInStub.called).toEqual(true);
  });

  it('should call the unauthorized path if currentUser is undefined', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => {};

    await runAction(isLoggedInAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(unauthorizedStub.called).toEqual(true);
  });
});
