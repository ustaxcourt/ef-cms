import clearAlerts from '../actions/clearAlertsAction';
import clearErrorAlerts from '../actions/clearErrorAlertsAction';
import getCasesByUser from '../actions/getCasesByUserAction';
import getUserRole from '../actions/getUserRoleAction';
import getUsersInSection from '../actions/getUsersInSectionAction';
import isLoggedIn from '../actions/isLoggedInAction';
import redirectToCognito from '../actions/redirectToCognitoAction';
import setCases from '../actions/setCasesAction';
import setCurrentPage from '../actions/setCurrentPageAction';
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
      getUsersInSection({ section: 'petitions' }),
      setUsers,
      ...chooseWorkQueueSequence,
      setCurrentPage('DashboardPetitionsClerk'),
    ],
    docketclerk: [
      getUsersInSection({ section: 'docket' }),
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
    unauthorized: [redirectToCognito],
    isLoggedIn: goToDashboard,
  },
];
