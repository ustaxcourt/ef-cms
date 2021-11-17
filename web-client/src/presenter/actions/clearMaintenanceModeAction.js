import { state } from 'cerebral';

export const clearMaintenanceModeAction = async ({ store }) => {
  store.unset(state.maintenanceMode);
};
