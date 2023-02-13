import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmDeletePDFModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('ConfirmDeletePDFModal'),
];
