import { getEligibleCasesForTrialSessionAction } from './getEligibleCasesForTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let getEligibleCasesForTrialSessionStub;

describe('getEligibleCasesForTrialSessionAction', () => {
  beforeEach(() => {
    getEligibleCasesForTrialSessionStub = jest.fn().mockResolvedValue([
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
    expect(getEligibleCasesForTrialSessionStub.mock.calls.length).toEqual(1);
  });
});
