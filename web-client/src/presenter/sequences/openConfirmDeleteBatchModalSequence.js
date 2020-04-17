import { clearModalStateAction } from '../actions/clearModalStateAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmDeleteBatchModalSequence = [
  clearModalStateAction,
  set(state.scanner.batchIndexToDelete, props.batchIndexToDelete),
  set(state.scanner.batchToDeletePageCount, props.batchPageCount),
  setShowModalFactoryAction('ConfirmDeleteBatchModal'),
];
