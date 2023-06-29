import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the maintenance mode value
 * @param {object} applicationContext object that contains all the context specific methods
 * @param {object} props the cerebral props object
 * @param {object} store the cerebral store
 */
export const setMaintenanceModeAction = ({ props, store }: ActionProps) => {
  store.set(state.maintenanceMode, props.maintenanceMode);
};
