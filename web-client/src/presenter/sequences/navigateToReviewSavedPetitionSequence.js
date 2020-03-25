import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getCaseDetailFormWithComputedDatesAction } from '../actions/getCaseDetailFormWithComputedDatesAction';
import { navigateToReviewSavedPetitionAction } from '../actions/caseDetailEdit/navigateToReviewSavedPetitionAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const navigateToReviewSavedPetitionSequence = showProgressSequenceDecorator(
  [
    startShowValidationAction,
    clearAlertsAction,
    getCaseDetailFormWithComputedDatesAction,
    validateCaseDetailAction,
    {
      error: [setValidationAlertErrorsAction],
      success: [stopShowValidationAction, navigateToReviewSavedPetitionAction],
    },
  ],
);
