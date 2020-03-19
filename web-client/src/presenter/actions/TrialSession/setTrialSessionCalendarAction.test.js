import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setTrialSessionCalendarAction } from './setTrialSessionCalendarAction';

let setTrialSessionCalendarStub;

describe('setTrialSessionCalendarAction', () => {
  beforeEach(() => {
    setTrialSessionCalendarStub = jest.fn().mockResolvedValue([
      {
        trialSessionId: '345',
      },
    ]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        setTrialSessionCalendarInteractor: setTrialSessionCalendarStub,
      }),
    };
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
    expect(setTrialSessionCalendarStub.mock.calls.length).toEqual(1);
  });
});
