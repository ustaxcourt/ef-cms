import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getMaintenanceModeForPublicAction } from './getMaintenanceModeForPublicAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getMaintenanceModeForPublicAction', () => {
  const pathMaintenanceOnStub = jest.fn();
  const pathMaintenanceOffStub = jest.fn();

  presenter.providers.path = {
    maintenanceOff: pathMaintenanceOffStub,
    maintenanceOn: pathMaintenanceOnStub,
  };

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getMaintenanceModePublicInteractor.mockReturnValue({
        data: true,
        headers: { 'x-terminal-user': false },
      });
  });

  it('should set maintenanceMode on state', async () => {
    const result = await runAction(getMaintenanceModeForPublicAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(result.state.maintenanceMode).toEqual(true);
    expect(result.state.isTerminalUser).toEqual(false);
  });

  it('should set maintenanceMode on state', async () => {
    applicationContext
      .getUseCases()
      .getMaintenanceModePublicInteractor.mockReturnValue({
        data: false,
        headers: { 'x-terminal-user': 'true' },
      });

    const result = await runAction(getMaintenanceModeForPublicAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(result.state.maintenanceMode).toEqual(false);
    expect(result.state.isTerminalUser).toEqual(true);
  });

  it('returns path.maintenanceOn if maintenance mode is turned on', async () => {
    await runAction(getMaintenanceModeForPublicAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(pathMaintenanceOnStub).toHaveBeenCalled();
  });

  it('returns path.maintenanceOff if maintenance mode is turned off', async () => {
    applicationContext
      .getUseCases()
      .getMaintenanceModePublicInteractor.mockReturnValue({
        data: false,
        headers: {},
      });

    await runAction(getMaintenanceModeForPublicAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(pathMaintenanceOffStub).toHaveBeenCalled();
  });
});
