import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getMaintenanceModeAction } from './getMaintenanceModeAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getMaintenanceModeAction', () => {
  const maintenanceModeMock = true;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockReturnValue(maintenanceModeMock);
  });

  it('returns the maintenance mode', async () => {
    const results = await runAction(getMaintenanceModeAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(results.maintenanceMode).toEqual([maintenanceModeMock]);
  });
});
