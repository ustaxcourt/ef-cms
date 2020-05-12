import { assignPetitionToAuthenticatedUserAction } from '../actions/WorkItem/assignPetitionToAuthenticatedUserAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getCaseDetailFormWithComputedDatesAction } from '../actions/getCaseDetailFormWithComputedDatesAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction'
import { navigateToReviewSavedPetitionAction } from '../actions/caseDetailEdit/navigateToReviewSavedPetitionAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction'
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction'
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
      stopShowValidationAction,
      saveCaseDetailInternalEditAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      setCaseAction,
      assignPetitionToAuthenticatedUserAction,
      setPetitionIdAction,
      setDocumentIdAction,
      navigateToDocumentQCAction,
    ],
  },
]);
