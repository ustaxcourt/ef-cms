import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const navigateBackSequence = [
  clearAlertsAction,
  set(state.showValidation, false),
  navigateBackAction,
];
