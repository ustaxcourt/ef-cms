import { isLoggedInAction } from './isLoggedInAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const isLoggedInStub = jest.fn();
const unauthorizedStub = jest.fn();

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

    expect(isLoggedInStub).toBeCalled();
  });

  it('should call the unauthorized path if currentUser is undefined', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => {};

    await runAction(isLoggedInAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(unauthorizedStub).toBeCalled();
  });
});
