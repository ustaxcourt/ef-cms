import { getCalendaredCasesForTrialSessionAction } from './getCalendaredCasesForTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getCalendaredCasesForTrialSessionStub;

describe('getCalendaredCasesForTrialSessionAction', () => {
  beforeEach(() => {
    getCalendaredCasesForTrialSessionStub = sinon.stub().resolves([
      {
        caseId: '345',
      },
    ]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getCalendaredCasesForTrialSessionInteractor: getCalendaredCasesForTrialSessionStub,
      }),
    };
  });

  it('call the use case to get the calendared cases', async () => {
    await runAction(getCalendaredCasesForTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: '123',
      },
      state: {},
    });
    expect(getCalendaredCasesForTrialSessionStub.calledOnce).toEqual(true);
  });
});
