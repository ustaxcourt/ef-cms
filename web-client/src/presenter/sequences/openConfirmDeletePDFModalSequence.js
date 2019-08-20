import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openConfirmDeletePDFModalSequence = [
  clearModalStateAction,
  set(state.showModal, 'ConfirmDeletePDFModal'),
];
