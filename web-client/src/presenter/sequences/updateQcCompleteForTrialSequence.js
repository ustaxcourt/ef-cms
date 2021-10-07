import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setQcCompleteOnCaseOnTrialSessionAction } from '../actions/TrialSession/setQcCompleteOnCaseOnTrialSessionAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { updateQcCompleteForTrialAction } from '../actions/TrialSession/updateQcCompleteForTrialAction';

export const updateQcCompleteForTrialSequence = showProgressSequenceDecorator([
  updateQcCompleteForTrialAction,
  {
    error: [setAlertErrorAction],
    success: [setQcCompleteOnCaseOnTrialSessionAction],
  },
]);
