import { state } from '@web-client/presenter/app.cerebral';

export const isMaintenanceModeEngagedAction = ({ get, path }: ActionProps) => {
  const maintenanceMode = get(state.maintenanceMode);

  if (maintenanceMode) {
    return path.maintenanceModeOn();
  }
  return path.maintenanceModeOff();
};
