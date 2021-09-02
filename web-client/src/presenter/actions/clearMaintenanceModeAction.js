import { state } from 'cerebral';

export const clearMaintenanceModeAction = async ({
  applicationContext,
  store,
}) => {
  store.unset(state.maintenanceMode);

  await applicationContext
    .getUseCases()
    .removeItemInteractor(applicationContext, {
      key: 'maintenanceMode',
    });
};
