import { clearModalAction } from '../actions/clearModalAction';
import { navigateToMinuteSheetForUnscheduledCaseAction } from '../actions/TrialSessionMinutes/navigateToMinuteSheetForUnscheduledCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateNewMinuteSheetModalAction } from '../actions/TrialSessionMinutes/validateNewMinuteSheetModalAction';

export const submitNewMinuteSheetSequence = [
  validateNewMinuteSheetModalAction,
  {
    error: [setValidationErrorsAction],
    success: [clearModalAction, navigateToMinuteSheetForUnscheduledCaseAction],
  },
];
