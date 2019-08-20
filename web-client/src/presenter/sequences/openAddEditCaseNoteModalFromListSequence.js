import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setAddEditCaseNoteModalStateFromListAction } from '../actions/TrialSessionWorkingCopy/setAddEditCaseNoteModalStateFromListAction';
import { state } from 'cerebral';

export const openAddEditCaseNoteModalFromListSequence = [
  clearModalStateAction,
  setAddEditCaseNoteModalStateFromListAction,
  set(state.showModal, 'AddEditCaseNoteModal'),
];
