import { runAction } from 'cerebral/test';

import presenter from '..';

import sinon from 'sinon';
import getCaseTypesAction from './getCaseTypesAction';
const getCaseTypesStub = sinon.stub().resolves(null);

presenter.providers.applicationContext = {
  getUseCases: () => ({
    getCaseTypes: getCaseTypesStub,
  }),
};

const successStub = sinon.stub();
const errorStub = sinon.stub();

presenter.providers.path = {
  success: successStub,
  error: errorStub,
};

describe('getCaseTypesAction', async () => {
  it('calls the success path on success', async () => {
    getCaseTypesStub.resolves([]);
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
    expect(successStub.called).toBeTruthy();
  });

  it('should take the error path if the getCaseTypes fails', async () => {
    getCaseTypesStub.resolves(null);
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
    expect(errorStub.called).toBeTruthy();
  });
});
