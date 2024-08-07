import { IDLE_LOGOUT_STATES } from '@shared/business/entities/EntityConstants';
import { handleIdleLogoutAction } from './handleIdleLogoutAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('handleIdleLogoutAction', () => {
  let presenter;

  beforeAll(() => {
    presenter = {
      providers: {
        path: {
          continue: jest.fn(),
          logout: jest.fn(),
        },
      },
    };
  });

  it('should stay in the INITIAL state if the user is not logged in', async () => {
    const result = await runAction(handleIdleLogoutAction, {
      modules: {
        presenter,
      },
      state: {
        constants: {
          SESSION_MODAL_TIMEOUT: 5000,
          SESSION_TIMEOUT: 10000,
        },
        fileUploadProgress: {
          isUploading: false,
        },
        idleLogoutState: {
          logoutAt: undefined,
          state: IDLE_LOGOUT_STATES.INITIAL,
        },
        lastIdleAction: 0,
        user: undefined,
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: undefined,
      state: IDLE_LOGOUT_STATES.INITIAL,
    });
  });

  it('should stay in the INITIAL state if the user is uploading', async () => {
    const result = await runAction(handleIdleLogoutAction, {
      modules: {
        presenter,
      },
      state: {
        constants: {
          SESSION_MODAL_TIMEOUT: 5000,
          SESSION_TIMEOUT: 10000,
        },
        fileUploadProgress: {
          isUploading: true,
        },
        idleLogoutState: {
          logoutAt: undefined,
          state: IDLE_LOGOUT_STATES.INITIAL,
        },
        lastIdleAction: 0,
        user: {},
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: undefined,
      state: IDLE_LOGOUT_STATES.INITIAL,
    });
  });

  it('should stay move into the MONITORING state if the user is logged in and currently in initial state', async () => {
    const result = await runAction(handleIdleLogoutAction, {
      modules: {
        presenter,
      },
      state: {
        constants: {
          SESSION_MODAL_TIMEOUT: 5000,
          SESSION_TIMEOUT: 10000,
        },
        fileUploadProgress: {
          isUploading: false,
        },
        idleLogoutState: {
          logoutAt: undefined,
          state: IDLE_LOGOUT_STATES.INITIAL,
        },
        lastIdleAction: 0,
        user: {},
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: expect.any(Number),
      state: IDLE_LOGOUT_STATES.MONITORING,
    });
  });

  it('should move into the COUNTDOWN if the current time is past the session timeout limits', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(11000);
    const result = await runAction(handleIdleLogoutAction, {
      modules: {
        presenter,
      },
      state: {
        constants: {
          SESSION_MODAL_TIMEOUT: 5000,
          SESSION_TIMEOUT: 10000,
        },
        fileUploadProgress: {
          isUploading: false,
        },
        idleLogoutState: {
          logoutAt: undefined,
          state: IDLE_LOGOUT_STATES.MONITORING,
        },
        lastIdleAction: 0,
        user: {},
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: expect.any(Number),
      state: IDLE_LOGOUT_STATES.COUNTDOWN,
    });
  });

  it('should logout if in COUNTDOWN and the total time has elapsed the total elapsed time', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(16000);
    const result = await runAction(handleIdleLogoutAction, {
      modules: {
        presenter,
      },
      state: {
        constants: {
          SESSION_MODAL_TIMEOUT: 5000,
          SESSION_TIMEOUT: 10000,
        },
        fileUploadProgress: {
          isUploading: false,
        },
        idleLogoutState: {
          logoutAt: 15000,
          state: IDLE_LOGOUT_STATES.COUNTDOWN,
        },
        lastIdleAction: 0,
        user: {},
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: undefined,
      state: IDLE_LOGOUT_STATES.INITIAL,
    });
    expect(presenter.providers.path.logout).toHaveBeenCalled();
  });
});
