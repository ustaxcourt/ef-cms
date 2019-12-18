import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetJudgesCaseNoteFromTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/unsetJudgesCaseNoteFromTrialSessionWorkingCopyAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateDeleteJudgesCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteJudgesCaseNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const deleteCaseWorkingCopyJudgesNoteSequence = [
  setWaitingForResponseAction,
  updateDeleteJudgesCaseNotePropsFromModalStateAction,
  unsetJudgesCaseNoteFromTrialSessionWorkingCopyAction,
  updateTrialSessionWorkingCopyAction,
  clearModalAction,
  clearModalStateAction,
  unsetWaitingForResponseAction,
];
