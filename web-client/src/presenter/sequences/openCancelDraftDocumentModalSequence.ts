import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openCancelDraftDocumentModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('CancelDraftDocumentModal'),
];
