import clearAlerts from '../actions/clearAlertsAction';
import getCasesByUser from '../actions/getCasesByUserAction';
import getCasesNew from '../actions/getCasesNewAction';
import getUserRole from '../actions/getUserRoleAction';
import getUsersInSection from '../actions/getUsersInSectionAction';
import getWorkItemsByUser from '../actions/getWorkItemsByUserAction';
import getWorkItemsForSection from '../actions/getWorkItemsForSectionAction';
import isLoggedIn from '../actions/isLoggedInAction';
import navigateToLogin from '../actions/navigateToLoginAction';
import setAlertError from '../actions/setAlertErrorAction';
import setCases from '../actions/setCasesAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import setPath from '../actions/setPathAction';
import setSectionWorkQueue from '../actions/setSectionWorkQueueAction';
import setUsers from '../actions/setUsersAction';
import setWorkItems from '../actions/setWorkItemsAction';

const goToDashboard = [
  getUserRole,
  {
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
      getWorkItemsForSection('petition'),
      setSectionWorkQueue,
      getWorkItemsByUser,
      setWorkItems,
      setCurrentPage('DashboardPetitionsClerk'),
    ],
    docketclerk: [
      getUsersInSection({ sectionType: 'docket' }),
      {
        error: [setAlertError],
        success: [setUsers],
      },
      getWorkItemsForSection('docket'),
      setSectionWorkQueue,
      getWorkItemsByUser,
      setWorkItems,
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
      setWorkItems,
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
