import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getMaintenanceModeAction } from './getMaintenanceModeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getMaintenanceModeAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockReturnValue(true);
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
  });

  it('should return false when maintenance mode is turned off', async () => {
    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockReturnValue(false);

    const result = await runAction(getMaintenanceModeAction, {
      modules: {
        presenter,
      },
      state: {
        maintenanceMode: false,
      },
    });

    expect(result.output.maintenanceMode).toEqual(false);
  });
});
