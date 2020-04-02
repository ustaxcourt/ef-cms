import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { isLoggedInAction } from './isLoggedInAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('isLoggedInAction', () => {
  const isLoggedInStub = jest.fn();
  const unauthorizedStub = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      isLoggedIn: isLoggedInStub,
      unauthorized: unauthorizedStub,
    };

    presenter.providers.router = {
      route: () => {},
    };
  });

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
