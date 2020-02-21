import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { unsetJudgesCaseNoteFromTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/unsetJudgesCaseNoteFromTrialSessionWorkingCopyAction';
import { updateDeleteJudgesCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteJudgesCaseNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const deleteCaseWorkingCopyJudgesNoteSequence = showProgressSequenceDecorator(
  [
    updateDeleteJudgesCaseNotePropsFromModalStateAction,
    unsetJudgesCaseNoteFromTrialSessionWorkingCopyAction,
    updateTrialSessionWorkingCopyAction,
    clearModalAction,
    clearModalStateAction,
  ],
);
