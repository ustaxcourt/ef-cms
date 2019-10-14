import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setEditRespondentsFormAction } from '../actions/CaseDetail/setEditRespondentsFormAction';
import { state } from 'cerebral';

export const openEditRespondentsModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setEditRespondentsFormAction,
  set(state.showModal, 'EditRespondentsModal'),
];
