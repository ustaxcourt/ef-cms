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
    docketclerk: [clearAlerts, setCurrentPage('DashboardDocketClerk')],
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
    seniorattorney: [clearAlerts, setCurrentPage('DashboardSeniorAttorney')],
  },
];

export default [
  isLoggedIn,
  {
    unauthorized: [setPath, navigateToLogin],
    isLoggedIn: goToDashboard,
  },
];
