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
          state: 'INITIAL',
        },
        lastIdleAction: 0,
        user: undefined,
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: undefined,
      state: 'INITIAL',
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
          state: 'INITIAL',
        },
        lastIdleAction: 0,
        user: {},
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: undefined,
      state: 'INITIAL',
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
          state: 'INITIAL',
        },
        lastIdleAction: 0,
        user: {},
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: expect.any(Number),
      state: 'MONITORING',
    });
  });

  it('should move into the COUNTDOWN if the current time is passed the session timeout limits', async () => {
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
          state: 'MONITORING',
        },
        lastIdleAction: 0,
        user: {},
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: expect.any(Number),
      state: 'COUNTDOWN',
    });
  });

  it('should logout if in COUNTDOWN and the total time has elasped the total elasped time', async () => {
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
          state: 'COUNTDOWN',
        },
        lastIdleAction: 0,
        user: {},
      },
    });

    expect(result.state.idleLogoutState).toEqual({
      logoutAt: undefined,
      state: 'INITIAL',
    });
    expect(presenter.providers.path.logout).toHaveBeenCalled();
  });
});
