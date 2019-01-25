import { runAction } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';
import getInternalUsers from './getInternalUsersAction';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    getInternalUsers: async () => {
      return null;
    },
  }),
};

describe('getInternalUsers', async () => {
  let errorSpy;

  beforeEach(() => {
    errorSpy = sinon.spy();
    presenter.providers.path = {
      success() {},
      error: errorSpy,
    };
  });

  it('should invoke the error path when no users are returned', async () => {
    await runAction(getInternalUsers, {
      state: {
        user: {
          userId: 'docketclerk',
          token: 'docketclerk',
        },
      },
      modules: {
        presenter,
      },
    });
    expect(errorSpy.called).toEqual(true);
  });
});
