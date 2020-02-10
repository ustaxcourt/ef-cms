import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getTrialSessionWorkingCopyAction } from '../actions/TrialSession/getTrialSessionWorkingCopyAction';
import { setTrialSessionWorkingCopyAction } from '../actions/TrialSession/setTrialSessionWorkingCopyAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateCalendaredCaseJudgesNoteAction } from '../actions/TrialSessionWorkingCopy/updateCalendaredCaseJudgesNoteAction';
import { updateJudgesCaseNoteAction } from '../actions/TrialSession/updateJudgesCaseNoteAction';
import { updateNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateNotePropsFromModalStateAction';
import { validateNoteAction } from '../actions/validateNoteAction';

export const updateJudgesCaseNoteOnWorkingCopySequence = [
  startShowValidationAction,
  validateNoteAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      updateNotePropsFromModalStateAction,
      updateJudgesCaseNoteAction,
      getTrialSessionWorkingCopyAction,
      setTrialSessionWorkingCopyAction,
      updateCalendaredCaseJudgesNoteAction,
      clearModalAction,
      clearModalStateAction,
    ]),
  },
];
