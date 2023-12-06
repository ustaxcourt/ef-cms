import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditUserCaseNoteModalStateFromListAction } from '../actions/TrialSessionWorkingCopy/setAddEditUserCaseNoteModalStateFromListAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditUserCaseNoteModalFromListSequence = [
  clearModalStateAction,
  setAddEditUserCaseNoteModalStateFromListAction,
  setShowModalFactoryAction('AddEditUserCaseNoteModal'),
];
