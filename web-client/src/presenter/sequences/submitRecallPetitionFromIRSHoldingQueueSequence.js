import clearAlerts from '../actions/clearAlertsAction';
import navigateToDashboard from '../actions/navigateToDashboardAction';
import recallPetitionFromIRSHoldingQueue from '../actions/recallPetitionFromIRSHoldingQueueAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import clearModal from '../actions/clearModalAction';
import getCase from '../actions/getCaseAction';
import setCase from '../actions/setCaseAction';

export default [
  clearAlerts,
  clearModal,
  recallPetitionFromIRSHoldingQueue,
  getCase,
  setCase,
  setAlertSuccess,
  navigateToDashboard,
];
