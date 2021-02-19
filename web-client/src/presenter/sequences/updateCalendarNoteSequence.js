import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { saveCalendarNoteAction } from '../actions/TrialSession/saveCalendarNoteAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
// import { setCaseNoteOnCaseDetailAction } from '../actions/CaseNotes/setCaseNoteOnCaseDetailAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCalendarNoteAction } from '../actions/validateCalendarNoteAction';

export const updateCalendarNoteSequence = [
  // startShowValidationAction,
  () => {
    console.log('hola');
  },
  validateCalendarNoteAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      saveCalendarNoteAction,
      // setCaseNoteOnCaseDetailAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
    ]),
  },
];
