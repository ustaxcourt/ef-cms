import { getAssociatedCasesForTrialSessionAction } from './getAssociatedCasesForTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getAssociatedCasesForTrialSessionStub;

describe('getAssociatedCasesForTrialSessionAction', () => {
  beforeEach(() => {
    getAssociatedCasesForTrialSessionStub = sinon.stub().resolves([
      {
        caseId: '345',
      },
    ]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getAssociatedCasesForTrialSession: getAssociatedCasesForTrialSessionStub,
      }),
    };
  });

  it('call the use case to get the associated cases', async () => {
    await runAction(getAssociatedCasesForTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: '123',
      },
      state: {},
    });
    expect(getAssociatedCasesForTrialSessionStub.calledOnce).toEqual(true);
  });
});
