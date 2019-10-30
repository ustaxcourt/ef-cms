import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditCaseNoteModalStateFromListAction } from '../actions/TrialSessionWorkingCopy/setAddEditCaseNoteModalStateFromListAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditCaseNoteModalFromListSequence = [
  clearModalStateAction,
  setAddEditCaseNoteModalStateFromListAction,
  setShowModalFactoryAction('AddEditCaseNoteModal'),
];
