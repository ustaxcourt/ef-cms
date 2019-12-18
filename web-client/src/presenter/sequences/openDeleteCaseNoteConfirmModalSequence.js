import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDeleteCaseNoteModalStateAction } from '../actions/CaseDetail/setDeleteCaseNoteModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDeleteCaseNoteConfirmModalSequence = [
  clearModalStateAction,
  setDeleteCaseNoteModalStateAction,
  setShowModalFactoryAction('DeleteCaseNoteConfirmModal'),
];
