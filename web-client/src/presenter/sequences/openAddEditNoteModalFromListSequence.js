import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setAddEditNoteModalStateFromListAction } from '../actions/TrialSessionWorkingCopy/setAddEditNoteModalStateFromListAction';
import { state } from 'cerebral';

export const openAddEditNoteModalFromListSequence = [
  clearModalStateAction,
  setAddEditNoteModalStateFromListAction,
  set(state.showModal, 'AddEditNoteModal'),
];
