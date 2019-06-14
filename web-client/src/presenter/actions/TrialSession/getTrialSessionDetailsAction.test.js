import { getTrialSessionDetailsAction } from './getTrialSessionDetailsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getTrialSessionDetailsStub;

describe('getTrialSessionDetailsAction', () => {
  beforeEach(() => {
    getTrialSessionDetailsStub = sinon.stub().resolves({
      trialSessionId: '123',
    });

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getTrialSessionDetails: getTrialSessionDetailsStub,
      }),
    };
  });

  it('call the use case to get the eligible cases', async () => {
    await runAction(getTrialSessionDetailsAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: '123',
      },
      state: {},
    });
    expect(getTrialSessionDetailsStub.calledOnce).toEqual(true);
  });
});
