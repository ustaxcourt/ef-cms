import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCaseNoteAction } from '../actions/CaseNotes/deleteCaseNoteAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const deleteCaseNoteSequence = [
  setWaitingForResponseAction,
  deleteCaseNoteAction,
  setCaseAction,
  clearModalAction,
  clearModalStateAction,
  unsetWaitingForResponseAction,
];
