import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDateRangeForDeadlinesAction } from '../actions/CaseDeadline/updateDateRangeForDeadlinesAction';
import { validateSearchDeadlinesAction } from '../actions/CaseDeadline/validateSearchDeadlinesAction';

export const updateDateRangeForDeadlinesSequence = [
  validateSearchDeadlinesAction,
  {
    error: [
      startShowValidationAction,
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      clearAlertsAction,
      updateDateRangeForDeadlinesAction,
      stopShowValidationAction,
    ],
  },
];
