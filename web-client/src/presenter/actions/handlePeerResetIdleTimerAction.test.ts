import { LOGOUT_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { handlePeerResetIdleTimerAction } from './handlePeerResetIdleTimerAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('handlePeerResetIdleTimerAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should not clear the idle logout state unless it is currently in COUNTDOWN', async () => {
    const result = await runAction(handlePeerResetIdleTimerAction, {
      modules: {
        presenter,
      },
      state: {
        idleLogoutState: {
          state: LOGOUT_OPTIONS.idleLogoutStates.COUNTDOWN,
        },
      },
    });

    expect(result.state.idleLogoutState.state).toEqual(
      LOGOUT_OPTIONS.idleLogoutStates.COUNTDOWN,
    );
  });

  it('should reset the idle logout state when not COUNTDOWN', async () => {
    const result = await runAction(handlePeerResetIdleTimerAction, {
      modules: {
        presenter,
      },
      state: {
        idleLogoutState: {
          state: LOGOUT_OPTIONS.idleLogoutStates.MONITORING,
        },
      },
    });

    expect(result.state.idleLogoutState.state).toEqual(
      LOGOUT_OPTIONS.idleLogoutStates.INITIAL,
    );
  });
});
