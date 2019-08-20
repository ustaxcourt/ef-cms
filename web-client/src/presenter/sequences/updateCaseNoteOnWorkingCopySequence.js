import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateCaseNoteInTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/updateCaseNoteInTrialSessionWorkingCopyAction';
import { updateNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';
import { validateCaseNoteAction } from '../actions/Cases/validateCaseNoteAction';

export const updateCaseNoteOnWorkingCopySequence = [
  startShowValidationAction,
  validateCaseNoteAction,
  {
    error: [setValidationErrorsAction],
    success: [
      stopShowValidationAction,
      clearAlertsAction,
      updateNotePropsFromModalStateAction,
      updateCaseNoteInTrialSessionWorkingCopyAction,
      updateTrialSessionWorkingCopyAction,
      clearModalAction,
      clearModalStateAction,
    ],
  },
];
