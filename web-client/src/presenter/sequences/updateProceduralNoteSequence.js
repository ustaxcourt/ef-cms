import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { saveProceduralNoteAction } from '../actions/ProceduralNotes/saveProceduralNoteAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateNoteAction } from '../actions/validateNoteAction';

export const updateProceduralNoteSequence = [
  startShowValidationAction,
  validateNoteAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      stopShowValidationAction,
      clearAlertsAction,
      saveProceduralNoteAction,
      setCaseAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      unsetWaitingForResponseAction,
    ],
  },
];
