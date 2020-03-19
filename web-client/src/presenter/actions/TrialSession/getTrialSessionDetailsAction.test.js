import { getTrialSessionDetailsAction } from './getTrialSessionDetailsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let getTrialSessionDetailsStub;

describe('getTrialSessionDetailsAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getTrialSessionDetailsInteractor: getTrialSessionDetailsStub,
      }),
    };
  });

  it('call the use case to get the trial details', async () => {
    getTrialSessionDetailsStub = jest.fn().mockResolvedValue({
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
    expect(getTrialSessionDetailsStub.mock.calls.length).toEqual(1);
    expect(getTrialSessionDetailsStub.mock.calls[0][0].trialSessionId).toEqual(
      '123',
    );
  });

  it('call the use case a second time if the trial session is a swing session', async () => {
    getTrialSessionDetailsStub = jest.fn().mockResolvedValue({
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
    expect(getTrialSessionDetailsStub.mock.calls.length).toEqual(2);
    expect(getTrialSessionDetailsStub.mock.calls[0][0].trialSessionId).toEqual(
      '123',
    );
    expect(getTrialSessionDetailsStub.mock.calls[1][0].trialSessionId).toEqual(
      '234',
    );
  });
});
