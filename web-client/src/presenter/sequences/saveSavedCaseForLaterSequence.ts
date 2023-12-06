import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { filterEmptyStatisticsAction } from '../actions/StartCaseInternal/filterEmptyStatisticsAction';
import { getPetitionIdAction } from '../actions/getPetitionIdAction';
import { navigateToReviewSavedPetitionAction } from '../actions/CaseDetailEdit/navigateToReviewSavedPetitionAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCaseTypeAction } from '../actions/setCaseTypeAction';
import { setContactsOnFormAction } from '../actions/setContactsOnFormAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocumentSelectedForPreviewAction } from '../actions/unsetDocumentSelectedForPreviewAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const saveSavedCaseForLaterSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  startShowValidationAction,
  filterEmptyStatisticsAction,
  validateCaseDetailAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      setupCurrentPageAction('Interstitial'),
      clearModalAction,
      unsetDocumentSelectedForPreviewAction,
      stopShowValidationAction,
      setCaseTypeAction,
      saveCaseDetailInternalEditAction,
      setCaseAction,
      setCaseOnFormAction,
      setContactsOnFormAction,
      getPetitionIdAction,
      setDocketEntryIdAction,
      navigateToReviewSavedPetitionAction,
    ],
  },
]);
