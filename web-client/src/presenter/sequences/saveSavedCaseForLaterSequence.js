import { assignPetitionToAuthenticatedUserAction } from '../actions/WorkItem/assignPetitionToAuthenticatedUserAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeIrsNoticeDateAction } from '../actions/StartCaseInternal/computeIrsNoticeDateAction';
import { getCaseDetailFormWithComputedDatesAction } from '../actions/getCaseDetailFormWithComputedDatesAction';
import { navigateToReviewSavedPetitionAction } from '../actions/caseDetailEdit/navigateToReviewSavedPetitionAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseInProgressAction } from '../actions/StartCaseInternal/setCaseInProgressAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveSavedCaseForLaterSequence = showProgressSequenceDecorator([
  computeDateReceivedAction,
  computeIrsNoticeDateAction,
  setCaseInProgressAction,
  getCaseDetailFormWithComputedDatesAction,
  saveCaseDetailInternalEditAction,
  setCaseAction,
  assignPetitionToAuthenticatedUserAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  setPetitionIdAction,
  setDocumentIdAction,
  navigateToReviewSavedPetitionAction,
]);
