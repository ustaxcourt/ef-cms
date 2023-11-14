import { openTrialSessionInNewTabAction } from './openTrialSessionInNewTabAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('openTrialSessionInNewTabAction', () => {
  beforeAll(() => {
    window.open = jest.fn();
  });

  it('calls window.open with a blank tab for the current last created trial session on state', async () => {
    const trialSessionId = '05200d0a-187f-4b82-a45d-295a8c14449e';
    await runAction(openTrialSessionInNewTabAction, {
      state: {
        lastCreatedTrialSessionId: trialSessionId,
      },
    });

    expect(window.open).toHaveBeenCalledWith(
      `/trial-session-detail/${trialSessionId}`,
      '_blank',
    );
  });

  it('calls window.open with a blank tab for the given props.trialSession', async () => {
    const trialSessionId = '231ef42c-b038-463c-b4fd-a4481172bf93';
    await runAction(openTrialSessionInNewTabAction, {
      props: {
        trialSession: trialSessionId,
      },
    });

    expect(window.open).toHaveBeenCalledWith(
      `/trial-session-detail/${trialSessionId}`,
      '_blank',
    );
  });
});
