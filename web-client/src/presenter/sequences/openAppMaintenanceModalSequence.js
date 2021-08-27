import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAppMaintenanceModalSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [setShowModalFactoryAction('AppMaintenanceModal')],
    unauthorized: [navigateToPathAction],
  },
];
