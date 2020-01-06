import { setQcCompleteOnCaseOnTrialSessionAction } from '../actions/TrialSession/setQcCompleteOnCaseOnTrialSessionAction';
import { updateQcCompleteForTrialAction } from '../actions/TrialSession/updateQcCompleteForTrialAction';

export const updateQcCompleteForTrialSequence = [
  updateQcCompleteForTrialAction,
  { error: [], success: [setQcCompleteOnCaseOnTrialSessionAction] },
];
