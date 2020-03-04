import { assignPetitionToAuthenticatedUserAction } from '../actions/WorkItem/assignPetitionToAuthenticatedUserAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeIrsNoticeDateAction } from '../actions/StartCaseInternal/computeIrsNoticeDateAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseInProgressAction } from '../actions/StartCaseInternal/setCaseInProgressAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveSavedCaseForLaterSequence = showProgressSequenceDecorator([
  computeDateReceivedAction,
  computeIrsNoticeDateAction,
  setCaseInProgressAction,
  getFormCombinedWithCaseDetailAction,
  saveCaseDetailInternalEditAction,
  setCaseAction,
  assignPetitionToAuthenticatedUserAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToDocumentQCAction,
]);
