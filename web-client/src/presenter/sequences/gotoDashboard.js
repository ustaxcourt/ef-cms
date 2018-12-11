import clearAlerts from '../actions/clearAlerts';
import getCasesByUser from '../actions/getCasesByUser';
import getCasesNew from '../actions/getCasesNew';
import getUserRole from '../actions/getUserRole';
import setAlertError from '../actions/setAlertError';
import setCases from '../actions/setCases';
import setCurrentPage from '../actions/setCurrentPage';
import isLoggedIn from '../actions/isLoggedIn';
import setPath from '../actions/setPath';
import navigateToLogin from '../actions/navigateToLogin';

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
  },
];

export default [
  isLoggedIn,
  {
    unauthorized: [setPath, navigateToLogin],
    isLoggedIn: goToDashboard,
  },
];
