import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditJudgesCaseNoteModalStateFromListAction } from '../actions/TrialSessionWorkingCopy/setAddEditJudgesCaseNoteModalStateFromListAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditJudgesCaseNoteModalFromListSequence = [
  clearModalStateAction,
  setAddEditJudgesCaseNoteModalStateFromListAction,
  setShowModalFactoryAction('AddEditJudgesCaseNoteModal'),
];
