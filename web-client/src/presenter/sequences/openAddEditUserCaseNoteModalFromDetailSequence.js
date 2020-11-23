import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

import { getAction } from '../actions/actionFactory';

const setAddEditUserCaseNoteModalStateFromDetailAction = getAction(
  'setAddEditUserCaseNoteModalStateFromDetailAction',
);

export const openAddEditUserCaseNoteModalFromDetailSequence = [
  clearModalStateAction,
  setAddEditUserCaseNoteModalStateFromDetailAction,
  setShowModalFactoryAction('AddEditUserCaseNoteModal'),
];
