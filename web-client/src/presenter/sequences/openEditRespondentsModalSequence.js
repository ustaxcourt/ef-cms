import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setEditRespondentsAction } from '../actions/ManualAssociation/setEditRespondentsAction';
import { state } from 'cerebral';

export const openEditRespondentsModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setEditRespondentsAction,
  set(state.showModal, 'EditRespondentsModal'),
];
