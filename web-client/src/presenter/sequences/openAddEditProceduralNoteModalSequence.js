import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditProceduralNoteModalStateFromDetailAction } from '../actions/CaseDetail/setAddEditProceduralNoteModalStateFromDetailAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditProceduralNoteModalSequence = [
  clearModalStateAction,
  setAddEditProceduralNoteModalStateFromDetailAction,
  setShowModalFactoryAction('AddEditProceduralNoteModal'),
];
