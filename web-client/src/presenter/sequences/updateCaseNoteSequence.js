import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { saveCaseNoteAction } from '../actions/CaseNotes/saveCaseNoteAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseNoteOnCaseDetailAction } from '../actions/CaseNotes/setCaseNoteOnCaseDetailAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateNoteAction } from '../actions/validateNoteAction';

export const updateCaseNoteSequence = [
  startShowValidationAction,
  validateNoteAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      stopShowValidationAction,
      clearAlertsAction,
      saveCaseNoteAction,
      setCaseNoteOnCaseDetailAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      unsetWaitingForResponseAction,
    ],
  },
];
