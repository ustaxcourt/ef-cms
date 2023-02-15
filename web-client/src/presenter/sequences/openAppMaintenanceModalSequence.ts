import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setMaintenanceModeAction } from '../actions/setMaintenanceModeAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAppMaintenanceModalSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      setMaintenanceModeAction,
      setShowModalFactoryAction('AppMaintenanceModal'),
    ],
    unauthorized: [navigateToPathAction],
  },
];
