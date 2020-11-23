import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

import { setAddEditUserCaseNoteModalStateFromDetailAction } from '../actions/actionFactory';

export const openAddEditUserCaseNoteModalFromDetailSequence = [
  clearModalStateAction,
  setAddEditUserCaseNoteModalStateFromDetailAction,
  setShowModalFactoryAction('AddEditUserCaseNoteModal'),
];
