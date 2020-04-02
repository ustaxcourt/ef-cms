import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
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
      props: {
        trialSessionId: '123',
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().setTrialSessionCalendarInteractor.mock
        .calls.length,
    ).toEqual(1);
  });
});
