import { state } from 'cerebral';

/**
 * gets the maintenance mode value
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @param {object} get the cerebral get object
 * @param {object} path the cerebral path object
 * @param {object} store the cerebral store
 * @returns {object} path.maintenanceOn if true, path.maintenanceOff if false
 */
export const getMaintenanceModeAction = async ({
  applicationContext,
  get,
  path,
  store,
}) => {
  let maintenanceMode = get(state.maintenanceMode);

  if (maintenanceMode === null) {
    maintenanceMode = await applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor(applicationContext);

    store.set(state.maintenanceMode, maintenanceMode);

    await applicationContext
      .getUseCases()
      .setItemInteractor(applicationContext, {
        key: 'maintenanceMode',
        value: maintenanceMode,
      });
  }

  return maintenanceMode ? path.maintenanceOn() : path.maintenanceOff();
};
