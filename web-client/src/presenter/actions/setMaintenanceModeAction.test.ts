import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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
});
