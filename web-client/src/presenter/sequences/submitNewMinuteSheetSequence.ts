import { clearModalAction } from '../actions/clearModalAction';
import { navigateToMinuteSheetForUnscheduledCaseAction } from '../actions/TrialSession/navigateToMinuteSheetForUnscheduledCaseAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateNewMinuteSheetModalAction } from '../actions/TrialSession/validateNewMinuteSheetModalAction';

export const submitNewMinuteSheetSequence = [
  validateNewMinuteSheetModalAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [clearModalAction, navigateToMinuteSheetForUnscheduledCaseAction],
  },
];
