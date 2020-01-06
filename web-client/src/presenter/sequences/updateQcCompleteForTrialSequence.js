import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { updateQcCompleteForTrialAction } from '../actions/TrialSession/updateQcCompleteForTrialAction';

export const updateQcCompleteForTrialSequence = [
  updateQcCompleteForTrialAction,
  { error: [], success: [setTrialSessionDetailsAction] },
];
