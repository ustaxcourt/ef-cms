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

describe('isLoggedInAction', () => {
  it('should call path.isLoggedIn if state.user is defined', async () => {
    await runAction(isLoggedInAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          email: 'petitioner1@example.com',
        },
      },
    });

    expect(isLoggedInStub.called).toEqual(true);
  });

  it('should call the unauthorized path if state.user is undefined', async () => {
    await runAction(isLoggedInAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(unauthorizedStub.called).toEqual(true);
  });
});
