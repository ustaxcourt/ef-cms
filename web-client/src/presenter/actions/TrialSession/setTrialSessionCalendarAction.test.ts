import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionCalendarAction } from './setTrialSessionCalendarAction';

describe('setTrialSessionCalendarAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .setTrialSessionCalendarInteractor.mockResolvedValue([
        {
          trialSessionId: '345',
        },
      ]);
  });

  it('call the use case to get the eligible cases', async () => {
    await runAction(setTrialSessionCalendarAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          trialSessionId: '123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().setTrialSessionCalendarInteractor.mock
        .calls.length,
    ).toEqual(1);
  });

  it('throws an error if there is no trialSessionId', async () => {
    await expect(
      runAction(setTrialSessionCalendarAction, {
        modules: {
          presenter,
        },
        state: {},
      }),
    ).rejects.toThrow();
  });
});
