import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateJudgesCaseNoteInTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/updateJudgesCaseNoteInTrialSessionWorkingCopyAction';
import { updateNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';
import { validateNoteAction } from '../actions/validateNoteAction';

export const updateCaseWorkingCopyJudgesNoteSequence = [
  startShowValidationAction,
  validateNoteAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      stopShowValidationAction,
      clearAlertsAction,
      updateNotePropsFromModalStateAction,
      updateJudgesCaseNoteInTrialSessionWorkingCopyAction,
      updateTrialSessionWorkingCopyAction,
      clearModalAction,
      clearModalStateAction,
      unsetWaitingForResponseAction,
    ],
  },
];
