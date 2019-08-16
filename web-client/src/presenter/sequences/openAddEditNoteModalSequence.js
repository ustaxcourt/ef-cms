import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setAddEditNoteModalStateAction } from '../actions/TrialSessionWorkingCopy/setAddEditNoteModalStateAction';
import { state } from 'cerebral';

export const openAddEditNoteModalSequence = [
  clearModalStateAction,
  setAddEditNoteModalStateAction,
  set(state.showModal, 'AddEditNoteModal'),
];
