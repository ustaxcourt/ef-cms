import { assignPetitionToAuthenticatedUserAction } from '../actions/WorkItem/assignPetitionToAuthenticatedUserAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeIrsNoticeDateAction } from '../actions/StartCaseInternal/computeIrsNoticeDateAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setFormCaseStatusToInProgressAction } from '../actions/StartCaseInternal/setFormCaseStatusToInProgressAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveSavedCaseForLaterSequence = showProgressSequenceDecorator([
  computeDateReceivedAction,
  computeIrsNoticeDateAction,
  setFormCaseStatusToInProgressAction,
  getFormCombinedWithCaseDetailAction,
  saveCaseDetailInternalEditAction,
  setCaseAction,
  assignPetitionToAuthenticatedUserAction,
  navigateToCaseDetailAction,
]);
