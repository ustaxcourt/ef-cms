import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmDeleteCorrespondenceModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('DeleteCorrespondenceModal'),
];
