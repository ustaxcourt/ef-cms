import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditSessionNoteModalStateAction } from '../actions/TrialSessionWorkingCopy/setAddEditSessionNoteModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditSessionNoteModalSequence = [
  clearModalStateAction,
  setAddEditSessionNoteModalStateAction,
  setShowModalFactoryAction('AddEditSessionNoteModal'),
];
