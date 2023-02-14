import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionDetailsAction } from './getTrialSessionDetailsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getTrialSessionDetailsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('call the use case to get the trial details', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor.mockResolvedValue({
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

    expect(
      applicationContext.getUseCases().getTrialSessionDetailsInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().getTrialSessionDetailsInteractor.mock
        .calls[0][1].trialSessionId,
    ).toEqual('123');
  });

  it('call the use case a second time if the trial session is a swing session', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor.mockResolvedValue({
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

    expect(
      applicationContext.getUseCases().getTrialSessionDetailsInteractor.mock
        .calls.length,
    ).toEqual(2);
    expect(
      applicationContext.getUseCases().getTrialSessionDetailsInteractor.mock
        .calls[0][1].trialSessionId,
    ).toEqual('123');
    expect(
      applicationContext.getUseCases().getTrialSessionDetailsInteractor.mock
        .calls[1][1].trialSessionId,
    ).toEqual('234');
  });
});
