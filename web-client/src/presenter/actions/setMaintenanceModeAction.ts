import { state } from '@web-client/presenter/app.cerebral';

export const setMaintenanceModeAction = ({
  props,
  store,
}: ActionProps<{ maintenanceMode: boolean }>) => {
  store.set(state.maintenanceMode, props.maintenanceMode);
};
