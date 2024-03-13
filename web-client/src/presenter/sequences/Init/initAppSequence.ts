import { getMaintenanceModeAction } from '@web-client/presenter/actions/Maintenance/getMaintenanceModeAction';
import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { isMaintenanceModeEngagedAction } from '@web-client/presenter/actions/Maintenance/isMaintenanceModeEngagedAction';
import { navigateToMaintenanceAction } from '@web-client/presenter/actions/navigateToMaintenanceAction';
import { refreshTokenAction } from '@web-client/presenter/actions/Login/refreshTokenAction';
import { setMaintenanceModeAction } from '@web-client/presenter/actions/setMaintenanceModeAction';
import { setTokenAction } from '@web-client/presenter/actions/Login/setTokenAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { setUserPermissionsAction } from '@web-client/presenter/actions/setUserPermissionsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startRefreshIntervalSequence } from '@web-client/presenter/sequences/startRefreshIntervalSequence';

export const initAppSequence = showProgressSequenceDecorator([
  getMaintenanceModeAction,
  setMaintenanceModeAction,
  isMaintenanceModeEngagedAction,
  {
    maintenanceModeOff: [
      startRefreshIntervalSequence,
      refreshTokenAction,
      {
        userIsLoggedIn: [
          setTokenAction,
          getUserAction,
          setUserAction,
          setUserPermissionsAction,
        ],
        userIsNotLoggedIn: [],
      },
    ],
    maintenanceModeOn: [navigateToMaintenanceAction],
  },
]) as unknown as () => void;
