import { state } from 'cerebral';

export const clearMaintenanceModeAction = ({ store }: ActionProps) => {
  store.unset(state.maintenanceMode);
};
