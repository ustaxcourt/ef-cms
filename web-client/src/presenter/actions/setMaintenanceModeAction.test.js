import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setMaintenanceModeAction } from './setMaintenanceModeAction';

describe('setMaintenanceModeAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.maintenanceMode to the value passed in from props', async () => {
    const { state } = await runAction(setMaintenanceModeAction, {
      modules: { presenter },
      props: {
        maintenanceMode: true,
      },
      state: {},
    });
    expect(state.maintenanceMode).toBe(true);
  });

  it('should call setItemInteractor', async () => {
    await runAction(setMaintenanceModeAction, {
      modules: { presenter },
      props: {
        maintenanceMode: true,
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().setItemInteractor,
    ).toHaveBeenCalled();
  });
});
