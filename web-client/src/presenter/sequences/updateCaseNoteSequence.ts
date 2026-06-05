import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { refreshCaseMetadataAction } from '../actions/refreshCaseMetadataAction';
import { saveCaseNoteAction } from '../actions/CaseNotes/saveCaseNoteAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateNoteAction } from '../actions/validateNoteAction';
import { validateNoteOnCaseDetailAction } from '../actions/validateNoteOnCaseDetailAction';

export const updateCaseNoteSequence = [
  startShowValidationAction,
  validateNoteAction,
  {
    error: [setValidationErrorsAction],
    success: [
      validateNoteOnCaseDetailAction,
      {
        error: [setValidationErrorsAction],
        success: showProgressSequenceDecorator([
          stopShowValidationAction,
          clearAlertsAction,
          saveCaseNoteAction,
          refreshCaseMetadataAction,
          setAlertSuccessAction,
          clearModalAction,
          clearModalStateAction,
        ]),
      },
    ],
  },
];
