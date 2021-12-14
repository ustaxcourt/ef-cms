import { isLoggedInAction } from './isLoggedInAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('isLoggedInAction', () => {
  const isLoggedInStub = jest.fn();
  const unauthorizedStub = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      isLoggedIn: isLoggedInStub,
      unauthorized: unauthorizedStub,
    };

    presenter.providers.router = {
      route: () => {},
    };
  });

  it('should call path.isLoggedIn if currentUser is defined', async () => {
    await runAction(isLoggedInAction, {
      modules: {
        presenter,
      },
      state: {
        token: 'a',
      },
    });

    expect(isLoggedInStub).toBeCalled();
  });

  it('should call the unauthorized path if currentUser is undefined', async () => {
    await runAction(isLoggedInAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(unauthorizedStub).toBeCalled();
  });
});
