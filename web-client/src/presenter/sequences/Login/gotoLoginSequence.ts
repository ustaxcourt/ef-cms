import { getMaintenanceModeAction } from '@web-client/presenter/actions/Maintenance/getMaintenanceModeAction';
import { isMaintenanceModeEngagedAction } from '@web-client/presenter/actions/Maintenance/isMaintenanceModeEngagedAction';
import { navigateToMaintenanceAction } from '@web-client/presenter/actions/navigateToMaintenanceAction';
import { setMaintenanceModeAction } from '@web-client/presenter/actions/setMaintenanceModeAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const gotoLoginSequence = [
  getMaintenanceModeAction,
  setMaintenanceModeAction,
  isMaintenanceModeEngagedAction,
  {
    maintenanceModeOff: [setupCurrentPageAction('Login')],
    maintenanceModeOn: [navigateToMaintenanceAction],
  },
] as unknown as () => void;
