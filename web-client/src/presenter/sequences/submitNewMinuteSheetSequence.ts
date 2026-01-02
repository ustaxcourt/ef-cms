import { clearModalAction } from '../actions/clearModalAction';
import { navigateToMinuteSheetForUnscheduledCaseAction } from '../actions/TrialSession/navigateToMinuteSheetForUnscheduledCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateNewMinuteSheetModalAction } from '../actions/TrialSession/validateNewMinuteSheetModalAction';

export const submitNewMinuteSheetSequence = [
  validateNewMinuteSheetModalAction,
  {
    error: [setValidationErrorsAction],
    success: [clearModalAction, navigateToMinuteSheetForUnscheduledCaseAction],
  },
];
