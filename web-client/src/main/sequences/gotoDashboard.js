import clearAlerts from '../actions/clearAlerts';
import getCasesByUser from '../actions/getCasesByUser';
import getCasesNew from '../actions/getCasesNew';
import getUserRole from '../actions/getUserRole';
import setAlertError from '../actions/setAlertError';
import setCases from '../actions/setCases';
import setCurrentPage from '../actions/setCurrentPage';

export default [
  getUserRole,
  {
    taxpayer: [
      getCasesByUser,
      {
        error: [setAlertError],
        success: [setCases],
      },
      setCurrentPage('Dashboard'),
    ],
    petitionsclerk: [
      clearAlerts,
      getCasesNew,
      {
        error: [setAlertError],
        success: [setCases],
      },
      setCurrentPage('PetitionsWorkQueue'),
    ],
    intakeclerk: [clearAlerts, setCurrentPage('IntakeClerkDashboard')],
  },
];
