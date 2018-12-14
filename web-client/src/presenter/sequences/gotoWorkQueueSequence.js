import clearAlerts from '../actions/clearAlertsAction';
import getWorkItemsByUser from '../actions/getWorkItemsByUserAction';
import getUserRole from '../actions/getUserRoleAction';
import setAlertError from '../actions/setAlertErrorAction';
import setWorkItems from '../actions/setWorkItemsAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import isLoggedIn from '../actions/isLoggedInAction';
import setPath from '../actions/setPathAction';
import navigateToLogin from '../actions/navigateToLoginAction';

const goToWorkQueue = [
  getUserRole,
  {
    docketclerk: [
      clearAlerts,
      getWorkItemsByUser,
      {
        error: [setAlertError],
        success: [setWorkItems],
      },
      setCurrentPage('DashboardDocketClerk'),
    ],
    srattorney: [
      clearAlerts,
      getWorkItemsByUser,
      {
        error: [setAlertError],
        success: [setWorkItems],
      },
      setCurrentPage('DashboardSrAttorney'),
    ],
  },
];

export default [
  isLoggedIn,
  {
    unauthorized: [setPath, navigateToLogin],
    isLoggedIn: goToWorkQueue,
  },
];
