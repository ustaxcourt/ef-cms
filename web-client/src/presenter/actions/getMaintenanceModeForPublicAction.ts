import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the maintenance mode value for the public site
 * @param {object} applicationContext object that contains all the context specific methods
 * @param {object} path the cerebral path object
 * @param {object} store the cerebral store
 * @returns {object} path.maintenanceOn if true, path.maintenanceOff if false
 */
export const getMaintenanceModeForPublicAction = async ({
  applicationContext,
  path,
  store,
}: ActionProps) => {
  const { data: maintenanceMode, headers } = await applicationContext
    .getUseCases()
    .getMaintenanceModePublicInteractor(applicationContext);

  store.set(state.isTerminalUser, headers['x-terminal-user'] === 'true');
  store.set(state.maintenanceMode, maintenanceMode);

  return maintenanceMode ? path.maintenanceOn() : path.maintenanceOff();
};
