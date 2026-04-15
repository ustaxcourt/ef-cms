import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
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
}: ActionProps<{}, ClientPublicApplicationContext>) => {
  const { data: result, headers } = await applicationContext
    .getUseCases()
    .getMaintenanceModePublicInteractor(applicationContext);

  const maintenanceMode = typeof result === 'boolean' ? result : result.maintenanceMode;
  const readOnlyMode = typeof result === 'boolean' ? false : result.readOnlyMode;

  store.set(state.isTerminalUser, headers['x-terminal-user'] === 'true');
  store.set(state.maintenanceMode, maintenanceMode);
  store.set(state.readOnlyMode, readOnlyMode);

  return maintenanceMode ? path.maintenanceOn() : path.maintenanceOff();
};
