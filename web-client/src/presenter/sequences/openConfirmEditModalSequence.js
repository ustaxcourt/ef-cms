import { clearModalStateAction } from '../actions/clearModalStateAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const openConfirmEditModalSequence = [
  clearModalStateAction,
  set(state.path, props.path),
  set(state.docketNumber, props.docketNumber),
  set(state.documentIdToEdit, props.documentIdToEdit),
  set(state.caseId, props.caseId),
  set(state.showModal, 'ConfirmEditModal'),
];
