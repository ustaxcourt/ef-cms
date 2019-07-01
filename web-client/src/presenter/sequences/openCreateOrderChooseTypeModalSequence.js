import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openCreateOrderChooseTypeModalSequence = [
  clearFormAction,
  clearAlertsAction,
  set(state.showModal, 'CreateOrderChooseTypeModal'),
];
