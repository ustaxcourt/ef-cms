import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setAddEditSessionNoteModalStateAction } from '../actions/TrialSessionWorkingCopy/setAddEditSessionNoteModalStateAction';
import { state } from 'cerebral';

export const openAddEditSessionNoteModalSequence = [
  clearModalStateAction,
  setAddEditSessionNoteModalStateAction,
  set(state.showModal, 'AddEditSessionNoteModal'),
];
