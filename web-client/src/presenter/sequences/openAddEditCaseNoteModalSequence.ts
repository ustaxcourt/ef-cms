import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditCaseNoteModalStateFromDetailAction } from '../actions/CaseDetail/setAddEditCaseNoteModalStateFromDetailAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditCaseNoteModalSequence = [
  clearModalStateAction,
  setAddEditCaseNoteModalStateFromDetailAction,
  setShowModalFactoryAction('AddEditCaseNoteModal'),
];
