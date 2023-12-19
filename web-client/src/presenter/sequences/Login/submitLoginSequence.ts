import { decodeTokenAction } from '@web-client/presenter/actions/decodeTokenAction';
import { getMaintenanceModeAction } from '@web-client/presenter/actions/getMaintenanceModeAction';
import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { navigateToMaintenanceAction } from '@web-client/presenter/actions/navigateToMaintenanceAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setTokenAction } from '@web-client/presenter/actions/Login/setTokenAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { setUserPermissionsAction } from '@web-client/presenter/actions/setUserPermissionsAction';
import { submitLoginAction } from '@web-client/presenter/actions/Login/submitLoginAction';

export const submitLoginSequence = [
  submitLoginAction,
  decodeTokenAction,
  setTokenAction,
  getMaintenanceModeAction,
  {
    maintenanceOff: [
      getUserAction,
      setUserAction,
      setUserPermissionsAction,
      navigateToPathAction,
    ],
    maintenanceOn: [navigateToMaintenanceAction],
  },
] as unknown as (props) => void;
