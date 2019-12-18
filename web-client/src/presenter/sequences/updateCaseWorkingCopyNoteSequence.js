import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateCaseNoteInTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/updateCaseNoteInTrialSessionWorkingCopyAction';
import { updateNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';
import { validateNoteAction } from '../actions/validateNoteAction';

export const updateCaseWorkingCopyNoteSequence = [
  startShowValidationAction,
  validateNoteAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      stopShowValidationAction,
      clearAlertsAction,
      updateNotePropsFromModalStateAction,
      updateCaseNoteInTrialSessionWorkingCopyAction,
      updateTrialSessionWorkingCopyAction,
      clearModalAction,
      clearModalStateAction,
      unsetWaitingForResponseAction,
    ],
  },
];
