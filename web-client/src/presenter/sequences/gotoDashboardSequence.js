import clearAlerts from '../actions/clearAlertsAction';
import clearErrorAlerts from '../actions/clearErrorAlertsAction';
import getCasesByUser from '../actions/getCasesByUserAction';
import getUserRole from '../actions/getUserRoleAction';
import getUsersInSection from '../actions/getUsersInSectionAction';
import isLoggedIn from '../actions/isLoggedInAction';
import navigateToLogin from '../actions/navigateToLoginAction';
import setCases from '../actions/setCasesAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import setPath from '../actions/setPathAction';
import setUsers from '../actions/setUsersAction';
import chooseWorkQueueSequence from './chooseWorkQueueSequence';

const goToDashboard = [
  clearErrorAlerts,
  getUserRole,
  {
    petitioner: [
      getCasesByUser,
      setCases,
      setCurrentPage('DashboardPetitioner'),
    ],
    petitionsclerk: [
      getUsersInSection({ sectionType: 'petitions' }),
      setUsers,
      ...chooseWorkQueueSequence,
      setCurrentPage('DashboardPetitionsClerk'),
    ],
    docketclerk: [
      getUsersInSection({ sectionType: 'docket' }),
      setUsers,
      ...chooseWorkQueueSequence,
      setCurrentPage('DashboardDocketClerk'),
    ],
    intakeclerk: [clearAlerts, setCurrentPage('DashboardIntakeClerk')],
    respondent: [
      clearAlerts,
      getCasesByUser,
      setCases,
      setCurrentPage('DashboardRespondent'),
    ],
    seniorattorney: [
      clearAlerts,
      ...chooseWorkQueueSequence,
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
