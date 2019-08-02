import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getRespondentsBySearchKeyAction } from '../actions/ManualAssociation/getRespondentsBySearchKeyAction';
import { set } from 'cerebral/factories';
import { setRespondentsAction } from '../actions/ManualAssociation/setRespondentsAction';
import { state } from 'cerebral';

export const openAddRespondentModalSequence = [
  clearAlertsAction,
  getRespondentsBySearchKeyAction,
  setRespondentsAction,
  set(state.showModal, 'AddRespondentModal'),
];
