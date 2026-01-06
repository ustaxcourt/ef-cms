import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearNewMinuteSheetModalCaseInfoAction } from '../actions/TrialSession/clearNewMinuteSheetModalCaseInfoAction';
import { setNewMinuteSheetModalCaseInfoAction } from '../actions/TrialSession/setNewMinuteSheetModalCaseInfoAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateNewMinuteSheetModalAction } from '../actions/TrialSession/validateNewMinuteSheetModalAction';

export const validateNewMinuteSheetModalSequence = [
  clearNewMinuteSheetModalCaseInfoAction,
  validateNewMinuteSheetModalAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction, setNewMinuteSheetModalCaseInfoAction],
  },
];
