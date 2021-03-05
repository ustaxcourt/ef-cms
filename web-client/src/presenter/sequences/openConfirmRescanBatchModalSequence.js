import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setScannerBatchIndexToRescanAction } from '../actions/setScannerBatchIndexToRescanAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmRescanBatchModalSequence = [
  clearModalStateAction,
  setScannerBatchIndexToRescanAction,
  setShowModalFactoryAction('ConfirmRescanBatchModal'),
];
