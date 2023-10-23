import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getTrialSessionDetailsAction } from '@web-client/presenter/actions/TrialSession/getTrialSessionDetailsAction';
import { getTrialSessionIdAction } from '@web-client/presenter/actions/TrialSession/getTrialSessionIdAction';
import { sequence } from 'cerebral';
import { setTrialSessionDetailsAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionDetailsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const printPaperServiceForTrialCompleteSequence = sequence([
  clearAlertsAction,
  getTrialSessionIdAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  setupCurrentPageAction('TrialSessionDetail'),
]);
