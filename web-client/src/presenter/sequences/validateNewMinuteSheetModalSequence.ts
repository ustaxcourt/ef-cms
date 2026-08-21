import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearNewMinuteSheetModalCaseInfoAction } from '../actions/TrialSessionMinutes/clearNewMinuteSheetModalCaseInfoAction';
import { setNewMinuteSheetModalCaseInfoAction } from '../actions/TrialSessionMinutes/setNewMinuteSheetModalCaseInfoAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateNewMinuteSheetModalAction } from '../actions/TrialSessionMinutes/validateNewMinuteSheetModalAction';

export const validateNewMinuteSheetModalSequence = [
  clearNewMinuteSheetModalCaseInfoAction,
  validateNewMinuteSheetModalAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction, setNewMinuteSheetModalCaseInfoAction],
  },
];
