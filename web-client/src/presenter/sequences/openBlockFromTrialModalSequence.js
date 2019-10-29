import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openBlockFromTrialModalSequence = [
  stopShowValidationAction,
  clearModalAction,
  clearAlertsAction,
  set(state.showModal, 'BlockFromTrialModal'),
];
