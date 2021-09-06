import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateNotePropsFromModalStateAction';
import { updateUserCaseNoteAction } from '../actions/TrialSession/updateUserCaseNoteAction';
import { validateNoteAction } from '../actions/validateNoteAction';

export const updateJudgesCaseNoteOnCaseDetailSequence = [
  startShowValidationAction,
  validateNoteAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      updateNotePropsFromModalStateAction,
      updateUserCaseNoteAction,
      setJudgesCaseNoteOnCaseDetailAction,
      clearModalAction,
      clearModalStateAction,
    ]),
  },
];
