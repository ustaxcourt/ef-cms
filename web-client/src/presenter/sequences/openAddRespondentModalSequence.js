import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openAddRespondentModalSequence = [
  clearFormAction,
  clearAlertsAction,
  set(state.showModal, 'AddRespondentModal'),
];
