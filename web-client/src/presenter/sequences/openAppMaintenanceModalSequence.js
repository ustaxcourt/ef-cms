import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setPathForMaintenancePageAction } from '../actions/setPathForMaintenancePageAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAppMaintenanceModalSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [setShowModalFactoryAction('AppMaintenanceModal')],
    unauthorized: [setPathForMaintenancePageAction, navigateToPathAction],
  },
];
