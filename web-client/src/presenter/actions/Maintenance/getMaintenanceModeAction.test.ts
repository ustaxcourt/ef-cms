import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getMaintenanceModeAction } from './getMaintenanceModeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getMaintenanceModeAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockReturnValue({
        maintenanceMode: true,
        readOnlyMode: false,
      });
  });

  it('should return true when maintenance mode is turned on', async () => {
    const result = await runAction(getMaintenanceModeAction, {
      modules: {
        presenter,
      },
      state: {
        maintenanceMode: true,
      },
    });

    expect(result.output.maintenanceMode).toEqual(true);
    expect(result.output.readOnlyMode).toEqual(false);
  });

  it('should return false when maintenance mode is turned off', async () => {
    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockReturnValue({
        maintenanceMode: false,
        readOnlyMode: false,
      });

    const result = await runAction(getMaintenanceModeAction, {
      modules: {
        presenter,
      },
      state: {
        maintenanceMode: false,
      },
    });

    expect(result.output.maintenanceMode).toEqual(false);
    expect(result.output.readOnlyMode).toEqual(false);
  });

  it('should unpack readOnlyMode when API returns an object', async () => {
    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockReturnValue({
        maintenanceMode: false,
        readOnlyMode: true,
      });

    const result = await runAction(getMaintenanceModeAction, {
      modules: {
        presenter,
      },
      state: {
        maintenanceMode: false,
      },
    });

    expect(result.output.maintenanceMode).toEqual(false);
    expect(result.output.readOnlyMode).toEqual(true);
  });
});
