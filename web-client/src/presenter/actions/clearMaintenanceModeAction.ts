import { state } from 'cerebral';

export const clearMaintenanceModeAction = ({ store }) => {
  store.unset(state.maintenanceMode);
};
