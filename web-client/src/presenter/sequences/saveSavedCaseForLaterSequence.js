import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseDetailFormWithComputedDatesAction } from '../actions/getCaseDetailFormWithComputedDatesAction';
import { navigateToReviewSavedPetitionAction } from '../actions/caseDetailEdit/navigateToReviewSavedPetitionAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const saveSavedCaseForLaterSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  startShowValidationAction,
  getCaseDetailFormWithComputedDatesAction,
  validateCaseDetailAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      clearModalAction,
      stopShowValidationAction,
      saveCaseDetailInternalEditAction,
      setCaseAction,
      setPetitionIdAction,
      setDocumentIdAction,
      navigateToReviewSavedPetitionAction,
    ],
  },
]);
