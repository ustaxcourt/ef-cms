import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getMaintenanceModeAction } from './getMaintenanceModeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getMaintenanceModeAction', () => {
  const pathMaintenanceOnStub = jest.fn();
  const pathMaintenanceOffStub = jest.fn();

  presenter.providers.path = {
    maintenanceOff: pathMaintenanceOffStub,
    maintenanceOn: pathMaintenanceOnStub,
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockReturnValue(true);
  });

  it('should set maintenanceMode on state when it is null', async () => {
    const result = await runAction(getMaintenanceModeAction, {
      modules: {
        presenter,
      },
      state: {
        maintenanceMode: null,
      },
    });

    expect(result.state.maintenanceMode).toEqual(true);
  });

  it('returns path.maintenanceOn if maintenance mode is turned on', async () => {
    await runAction(getMaintenanceModeAction, {
      modules: {
        presenter,
      },
      state: {
        maintenanceMode: true,
      },
    });

    expect(pathMaintenanceOnStub).toHaveBeenCalled();
  });

  it('returns path.maintenanceOff if maintenance mode is turned off', async () => {
    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockReturnValue(false);

    await runAction(getMaintenanceModeAction, {
      modules: {
        presenter,
      },
      state: {
        maintenanceMode: false,
      },
    });

    expect(pathMaintenanceOffStub).toHaveBeenCalled();
  });
});
