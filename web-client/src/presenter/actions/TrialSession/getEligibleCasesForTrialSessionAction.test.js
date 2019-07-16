import { getEligibleCasesForTrialSessionAction } from './getEligibleCasesForTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getEligibleCasesForTrialSessionStub;

describe('getEligibleCasesForTrialSessionAction', () => {
  beforeEach(() => {
    getEligibleCasesForTrialSessionStub = sinon.stub().resolves([
      {
        caseId: '345',
      },
    ]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getEligibleCasesForTrialSessionInteractor: getEligibleCasesForTrialSessionStub,
      }),
    };
  });

  it('call the use case to get the eligible cases', async () => {
    await runAction(getEligibleCasesForTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: '123',
      },
      state: {},
    });
    expect(getEligibleCasesForTrialSessionStub.calledOnce).toEqual(true);
  });
});
