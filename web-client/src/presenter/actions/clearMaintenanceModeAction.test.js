import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { clearMaintenanceModeAction } from './clearMaintenanceModeAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

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

    expect(
      applicationContext.getUseCases().removeItemInteractor.mock.calls[0][1]
        .key,
    ).toBe('maintenanceMode');
  });
});
