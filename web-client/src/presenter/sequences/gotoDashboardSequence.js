import clearAlerts from '../actions/clearAlertsAction';
import getCasesByUser from '../actions/getCasesByUserAction';
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
    petitioner: [
      getCasesByUser,
      {
        error: [setAlertError],
        success: [setCases],
      },
      setCurrentPage('DashboardPetitioner'),
    ],
    petitionsclerk: [
      getUsersInSection({ sectionType: 'petitions' }),
      setUsers,
      getWorkItemsForSection,
      setSectionWorkQueue,
      getWorkItemsByUser,
      setWorkItems,
      setCurrentPage('DashboardPetitionsClerk'),
    ],
    docketclerk: [
      getUsersInSection({ sectionType: 'docket' }),
      setUsers,
      getWorkItemsForSection,
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
