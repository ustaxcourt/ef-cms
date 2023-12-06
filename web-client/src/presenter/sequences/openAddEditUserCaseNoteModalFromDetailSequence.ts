import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditUserCaseNoteModalStateFromDetailAction } from '../actions/TrialSessionWorkingCopy/setAddEditUserCaseNoteModalStateFromDetailAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditUserCaseNoteModalFromDetailSequence = [
  clearModalStateAction,
  setAddEditUserCaseNoteModalStateFromDetailAction,
  setShowModalFactoryAction('AddEditUserCaseNoteModal'),
];
