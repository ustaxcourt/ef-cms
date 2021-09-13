import { state } from 'cerebral';

/**
 * sets the maintenance mode value
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @param {object} props the cerebral props object
 * @param {object} store the cerebral store
 */
export const setMaintenanceModeAction = async ({
  applicationContext,
  props,
  store,
}) => {
  store.set(state.maintenanceMode, props.maintenanceMode);

  await applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'maintenanceMode',
    value: props.maintenanceMode,
  });
};
