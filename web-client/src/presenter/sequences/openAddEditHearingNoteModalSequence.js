import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCalendarNoteModalAction } from '../actions/setCalendarNoteModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditHearingNoteModalSequence = [
  clearModalStateAction,
  setCalendarNoteModalAction,
  setShowModalFactoryAction('AddEditHearingNoteModal'),
];
