import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearMaintenanceModeAction } from './clearMaintenanceModeAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearMaintenanceModeAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should unset state.maintenanceMode', async () => {
    const result = await runAction(clearMaintenanceModeAction, {
      modules: {
        presenter,
      },
      state: {
        maintenanceMode: true,
      },
    });

    expect(result.maintenanceMode).toBeUndefined();
  });

  it('should make a call to remove maintenanceMode from local storage', async () => {
    await runAction(clearMaintenanceModeAction, {
      modules: {
        presenter,
      },
      state: {},
    });
  });
});
