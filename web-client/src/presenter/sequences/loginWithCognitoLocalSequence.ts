import { authenticateUserAction } from '../actions/authenticateUserAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getMaintenanceModeAction } from '../actions/getMaintenanceModeAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToMaintenanceAction } from '../actions/navigateToMaintenanceAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setTokenAction } from '../actions/setTokenAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const loginWithCognitoLocalSequence = showProgressSequenceDecorator([
  authenticateUserAction,
  {
    newPasswordRequired: [navigateToPathAction],
    no: [setAlertErrorAction],
    yes: [
      decodeTokenAction,
      setTokenAction,
      getUserAction,
      setUserAction,
      setUserPermissionsAction,
      getMaintenanceModeAction,
      {
        maintenanceOff: [clearAlertsAction, navigateToPathAction],
        maintenanceOn: [navigateToMaintenanceAction],
      },
    ],
  },
]);
