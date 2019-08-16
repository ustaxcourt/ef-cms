import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setAddEditNoteModalStateFromDetailAction } from '../actions/TrialSessionWorkingCopy/setAddEditNoteModalStateFromDetailAction';
import { state } from 'cerebral';

export const openAddEditNoteModalFromDetailSequence = [
  clearModalStateAction,
  setAddEditNoteModalStateFromDetailAction,
  set(state.showModal, 'AddEditNoteModal'),
];
