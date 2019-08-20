import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setAddEditCaseNoteModalStateFromDetailAction } from '../actions/TrialSessionWorkingCopy/setAddEditCaseNoteModalStateFromDetailAction';
import { state } from 'cerebral';

export const openAddEditCaseNoteModalFromDetailSequence = [
  clearModalStateAction,
  setAddEditCaseNoteModalStateFromDetailAction,
  set(state.showModal, 'AddEditCaseNoteModal'),
];
