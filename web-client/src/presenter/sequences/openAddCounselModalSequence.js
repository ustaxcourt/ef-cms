import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const openAddCounselModalSequence = [
  clearFormAction,
  clearAlertsAction,
  set(state.form.counselType, props.counselType),
  set(state.showModal, 'AddCounselModal'),
];
