import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { navigateToReviewSavedPetitionAction } from '../actions/caseDetailEdit/navigateToReviewSavedPetitionAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateFormWithCaseDetailAction } from '../actions/caseDetailEdit/updateFormWithCaseDetailAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const navigateToReviewSavedPetitionSequence = showProgressSequenceDecorator(
  [
    startShowValidationAction,
    clearAlertsAction,
    getFormCombinedWithCaseDetailAction,
    validateCaseDetailAction,
    {
      error: [setValidationAlertErrorsAction],
      success: [
        stopShowValidationAction,
        updateFormWithCaseDetailAction,
        navigateToReviewSavedPetitionAction,
      ],
    },
  ],
);
