import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDeleteSessionNoteConfirmModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('DeleteSessionNoteConfirmModal'),
];
