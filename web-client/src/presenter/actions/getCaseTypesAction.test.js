import { runAction } from 'cerebral/test';

import presenter from '..';

import getCaseTypesAction from './getCaseTypesAction';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    getCaseTypes: async () => {
      return null;
    },
  }),
};

presenter.providers.path = {
  success() {},
  error() {},
};

describe('getCaseTypesAction', async () => {
  it('should take the error path if the getCaseTypes fails', async () => {
    await runAction(getCaseTypesAction, {
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
  });
});
