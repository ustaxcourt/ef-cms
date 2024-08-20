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

  it('should do nothing when the user is not logged in', async () => {
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
        token: undefined,
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: undefined,
      state: IDLE_LOGOUT_STATES.INITIAL,
    });
    expect(presenter.providers.path.continue).toHaveBeenCalled();
  });

  it('should do nothing when the client needs to be refreshed', async () => {
    const result = await runAction(handleIdleLogoutAction, {
      modules: {
        presenter,
      },
      state: {
        clientNeedsToRefresh: true,
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
        token: '92c17761-d382-4231-b497-bc8c9e3ffea1',
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: undefined,
      state: IDLE_LOGOUT_STATES.INITIAL,
    });
    expect(presenter.providers.path.continue).toHaveBeenCalled();
  });

  it('should stay in the INITIAL state when the user is uploading', async () => {
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
        token: '92c17761-d382-4231-b497-bc8c9e3ffea1',
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: undefined,
      state: IDLE_LOGOUT_STATES.INITIAL,
    });
    expect(presenter.providers.path.continue).toHaveBeenCalled();
  });

  it('should move into the MONITORING state when the user is logged in and currently in initial state', async () => {
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
        token: '9dfbf86d-d4e7-41da-a85a-1b57910a5eaa',
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: expect.any(Number),
      state: IDLE_LOGOUT_STATES.MONITORING,
    });
    expect(presenter.providers.path.continue).toHaveBeenCalled();
  });

  it('should move into the COUNTDOWN when the current time is past the session timeout limits', async () => {
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
        token: '0e4d3b74-89bc-44a0-a9b9-59f5eece40a5',
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: expect.any(Number),
      state: IDLE_LOGOUT_STATES.COUNTDOWN,
    });
    expect(presenter.providers.path.continue).toHaveBeenCalled();
  });

  it('should logout when in COUNTDOWN and the total time has elapsed the total elapsed time', async () => {
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
        token: 'd53d2132-860e-41a0-9f42-f73c7285721b',
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: undefined,
      state: IDLE_LOGOUT_STATES.INITIAL,
    });
    expect(presenter.providers.path.logout).toHaveBeenCalled();
  });
});
