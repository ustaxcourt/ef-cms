import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getMaintenanceModeForPublicAction } from './getMaintenanceModeForPublicAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getMaintenanceModeForPublicAction', () => {
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
      .getMaintenanceModePublicInteractor.mockReturnValue(true);
  });

  it('should set maintenanceMode on state', async () => {
    const result = await runAction(getMaintenanceModeForPublicAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(result.state.maintenanceMode).toEqual(true);
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
      .getMaintenanceModePublicInteractor.mockReturnValue(false);

    await runAction(getMaintenanceModeForPublicAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(pathMaintenanceOffStub).toHaveBeenCalled();
  });
});
