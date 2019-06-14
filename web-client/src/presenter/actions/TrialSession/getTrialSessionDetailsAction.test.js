import { getTrialSessionDetailsAction } from './getTrialSessionDetailsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getTrialSessionDetailsStub;

describe('getTrialSessionDetailsAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getTrialSessionDetails: getTrialSessionDetailsStub,
      }),
    };
  });

  it('call the use case to get the trial details', async () => {
    getTrialSessionDetailsStub = sinon.stub().resolves({
      trialSessionId: '123',
    });

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
    expect(
      getTrialSessionDetailsStub.getCall(0).args[0].trialSessionId,
    ).toEqual('123');
  });

  it('call the use case a second time if the trial session is a swing session', async () => {
    getTrialSessionDetailsStub = sinon.stub().resolves({
      swingSession: true,
      swingSessionId: '234',
      trialSessionId: '123',
    });

    await runAction(getTrialSessionDetailsAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: '123',
      },
      state: {},
    });
    expect(getTrialSessionDetailsStub.calledTwice).toEqual(true);
    expect(
      getTrialSessionDetailsStub.getCall(0).args[0].trialSessionId,
    ).toEqual('123');
    expect(
      getTrialSessionDetailsStub.getCall(1).args[0].trialSessionId,
    ).toEqual('234');
  });
});
