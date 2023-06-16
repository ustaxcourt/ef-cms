import { state } from '@web-client/presenter/app.cerebral';

export const clearMaintenanceModeAction = ({ store }: ActionProps) => {
  store.unset(state.maintenanceMode);
};
