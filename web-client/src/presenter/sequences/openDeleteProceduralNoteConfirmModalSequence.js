import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDeleteProceduralNoteModalStateAction } from '../actions/CaseDetail/setDeleteProceduralNoteModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDeleteProceduralNoteConfirmModalSequence = [
  clearModalStateAction,
  setDeleteProceduralNoteModalStateAction,
  setShowModalFactoryAction('DeleteProceduralNoteConfirmModal'),
];
