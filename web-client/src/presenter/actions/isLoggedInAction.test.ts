import { isLoggedInAction } from './isLoggedInAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isLoggedInAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeEach(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should say user is logged in when logged in', async () => {
    await runAction(isLoggedInAction, {
      modules: {
        presenter,
      },
      state: {
        token: '1234',
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should say user is not logged in when not logged in', async () => {
    await runAction(isLoggedInAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
