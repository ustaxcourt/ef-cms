import { clearModalStateAction } from '../actions/clearModalStateAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const openConfirmDeleteBatchModalSequence = [
  clearModalStateAction,
  set(state.batchIndexToDelete, props.batchIndexToDelete),
  set(state.batchToDeletePageCount, props.batchPageCount),
  set(state.showModal, 'ConfirmDeleteBatchModal'),
];
