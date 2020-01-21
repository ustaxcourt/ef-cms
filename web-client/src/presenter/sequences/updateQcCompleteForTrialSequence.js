import { setQcCompleteOnCaseOnTrialSessionAction } from '../actions/TrialSession/setQcCompleteOnCaseOnTrialSessionAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateQcCompleteForTrialAction } from '../actions/TrialSession/updateQcCompleteForTrialAction';

export const updateQcCompleteForTrialSequence = [
  setWaitingForResponseAction,
  updateQcCompleteForTrialAction,
  { error: [], success: [setQcCompleteOnCaseOnTrialSessionAction] },
  unsetWaitingForResponseAction,
];
