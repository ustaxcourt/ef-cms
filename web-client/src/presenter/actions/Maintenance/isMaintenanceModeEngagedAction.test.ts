import { isMaintenanceModeEngagedAction } from '@web-client/presenter/actions/Maintenance/isMaintenanceModeEngagedAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isMaintenanceModeEngagedAction', () => {
  let maintenanceModeOnStub;
  let maintenanceModeOffStub;

  beforeEach(() => {
    maintenanceModeOnStub = jest.fn();
    maintenanceModeOffStub = jest.fn();

    presenter.providers.path = {
      maintenanceModeOff: maintenanceModeOffStub,
      maintenanceModeOn: maintenanceModeOnStub,
    };
  });

  it('should call path.maintenanceModeOn when state.maintenanceMode is truthy', async () => {
    await runAction(isMaintenanceModeEngagedAction, {
      modules: {
        presenter,
      },
      state: { maintenanceMode: true },
    });

    expect(maintenanceModeOnStub).toHaveBeenCalled();
  });

  it('should call path.maintenanceModeOff when state.maintenanceMode is falsy', async () => {
    await runAction(isMaintenanceModeEngagedAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(maintenanceModeOffStub).toHaveBeenCalled();
  });
});
