import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setScannerBatchIndexToDeleteAction } from '../actions/setScannerBatchIndexToDeleteAction';
import { setScannerBatchToDeletePageCountAction } from '../actions/setScannerBatchToDeletePageCountAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmDeleteBatchModalSequence = [
  clearModalStateAction,
  setScannerBatchIndexToDeleteAction,
  setScannerBatchToDeletePageCountAction,
  setShowModalFactoryAction('ConfirmDeleteBatchModal'),
];
