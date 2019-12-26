import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteProceduralNoteAction } from '../actions/ProceduralNotes/deleteProceduralNoteAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const deleteProceduralNoteSequence = [
  setWaitingForResponseAction,
  deleteProceduralNoteAction,
  setCaseAction,
  clearModalAction,
  clearModalStateAction,
  unsetWaitingForResponseAction,
];
