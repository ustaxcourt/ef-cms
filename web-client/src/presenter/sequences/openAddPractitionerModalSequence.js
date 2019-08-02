import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openAddPractitionerModalSequence = [
  clearFormAction,
  clearAlertsAction,
  set(state.showModal, 'AddPractitionerModal'),
];
