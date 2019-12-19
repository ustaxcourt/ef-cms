import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditJudgesCaseNoteModalStateFromDetailAction } from '../actions/TrialSessionWorkingCopy/setAddEditJudgesCaseNoteModalStateFromDetailAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditJudgesCaseNoteModalFromDetailSequence = [
  clearModalStateAction,
  setAddEditJudgesCaseNoteModalStateFromDetailAction,
  setShowModalFactoryAction('AddEditJudgesCaseNoteModal'),
];
