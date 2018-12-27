import clearAlerts from '../actions/clearAlertsAction';
import getCasesByUser from '../actions/getCasesByUserAction';
import getCasesNew from '../actions/getCasesNewAction';
import getUserRole from '../actions/getUserRoleAction';
import setAlertError from '../actions/setAlertErrorAction';
import setCases from '../actions/setCasesAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import isLoggedIn from '../actions/isLoggedInAction';
import setPath from '../actions/setPathAction';
import navigateToLogin from '../actions/navigateToLoginAction';
import setWorkItems from '../actions/setWorkItemsAction';
import setSectionWorkQueue from '../actions/setSectionWorkQueueAction';
import getWorkItemsByUser from '../actions/getWorkItemsByUserAction';
import getWorkItemsForSection from '../actions/getWorkItemsForSectionAction';
import getUsersInSection from '../actions/getUsersInSectionAction';

const goToDashboard = [
  getUserRole,
  {
    public: [setCurrentPage('DashboardPublic')],
    taxpayer: [
      getCasesByUser,
      {
        error: [setAlertError],
        success: [setCases],
      },
      setCurrentPage('DashboardPetitioner'),
    ],
    petitionsclerk: [
      clearAlerts,
      getCasesNew,
      {
        error: [setAlertError],
        success: [setCases],
      },
      setCurrentPage('DashboardPetitionsClerk'),
    ],
    docketclerk: [
      clearAlerts,
      getUsersInSection('docket'),
      getWorkItemsForSection('docket'),
      {
        error: [setAlertError],
        success: [setSectionWorkQueue],
      },
      getWorkItemsByUser,
      {
        error: [setAlertError],
        success: [setWorkItems],
      },
      setCurrentPage('DashboardDocketClerk'),
    ],
    intakeclerk: [clearAlerts, setCurrentPage('DashboardIntakeClerk')],
    respondent: [
      clearAlerts,
      getCasesByUser,
      {
        error: [setAlertError],
        success: [setCases],
      },
      setCurrentPage('DashboardRespondent'),
    ],
    seniorattorney: [
      clearAlerts,
      getWorkItemsByUser,
      {
        error: [setAlertError],
        success: [setWorkItems],
      },
      setCurrentPage('DashboardSeniorAttorney'),
    ],
  },
];

export default [
  isLoggedIn,
  {
    unauthorized: [setPath, navigateToLogin],
    isLoggedIn: goToDashboard,
  },
];
