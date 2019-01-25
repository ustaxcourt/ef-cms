import { runAction } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';
import getProcedureTypes from './getProcedureTypesAction';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    getProcedureTypes: async () => {
      return null;
    },
  }),
};

describe('getProcedureTypes', async () => {
  let errorSpy;

  beforeEach(() => {
    errorSpy = sinon.spy();
    presenter.providers.path = {
      success() {},
      error: errorSpy,
    };
  });

  it('should invoke the error path when no procedure types are returned', async () => {
    await runAction(getProcedureTypes, {
      state: {
        user: {
          userId: 'docketclerk',
        },
      },
      modules: {
        presenter,
      },
    });
    expect(errorSpy.called).toEqual(true);
  });
});
