import { clearModalAction } from '../actions/clearModalAction';
import { refreshCaseMetadataAction } from '../actions/refreshCaseMetadataAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { unblockCaseFromTrialAction } from '../actions/CaseDetail/unblockCaseFromTrialAction';

export const unblockCaseFromTrialSequence = showProgressSequenceDecorator([
  unblockCaseFromTrialAction,
  setAlertSuccessAction,
  clearModalAction,
  refreshCaseMetadataAction,
]);
