import { getMaintenanceModeAction } from '@web-client/presenter/actions/getMaintenanceModeAction';
import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { navigateToMaintenanceAction } from '@web-client/presenter/actions/navigateToMaintenanceAction';
import { parallel } from 'cerebral/factories';
import { refreshTokenAction } from '@web-client/presenter/actions/Login/refreshTokenAction';
import { setMaintenanceModeAction } from '@web-client/presenter/actions/setMaintenanceModeAction';
import { setTokenAction } from '@web-client/presenter/actions/Login/setTokenAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { setUserPermissionsAction } from '@web-client/presenter/actions/setUserPermissionsAction';
import { startRefreshIntervalSequence } from '@web-client/presenter/sequences/startRefreshIntervalSequence';
import { state } from '@web-client/presenter/app.cerebral';

export const initAppSequence = [
  refreshTokenAction,
  setTokenAction,
  getMaintenanceModeAction,
  setMaintenanceModeAction,
  ({ get, path }: ActionProps) => {
    const maintenanceMode = get(state.maintenanceMode);

    if (maintenanceMode) {
      return path.maintenanceModeOn();
    }
    return path.maintenanceModeOff();
  },
  {
    maintenanceModeOff: [
      parallel([
        [getUserAction, setUserAction, setUserPermissionsAction],
        startRefreshIntervalSequence,
      ]),
    ],
    maintenanceModeOn: [navigateToMaintenanceAction],
  },
] as unknown as () => void;
