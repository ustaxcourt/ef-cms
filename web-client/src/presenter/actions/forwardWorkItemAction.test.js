import { runAction } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';
import forwardWorkItemAction from './forwardWorkItemAction';

const successStub = sinon.stub();
const errorStub = sinon.stub();

presenter.providers.path = {
  success: successStub,
  error: errorStub,
};

presenter.providers.applicationContext = {
  getUseCases: () => ({
    forwardWorkItem: async () => {
      throw new Error('failure');
    },
  }),
};

describe('forwardWorkItemAction', async () => {
  it('takes the error path on exceptions', async () => {
    await runAction(forwardWorkItemAction, {
      state: {
        form: {
          abc: {},
        },
        user: {
          userId: 'petitionsclerk',
        },
      },
      modules: {
        presenter,
      },
      props: {
        workItemId: 'abc',
      },
    });
    expect(errorStub.calledOnce).toEqual(true);
  });
});
