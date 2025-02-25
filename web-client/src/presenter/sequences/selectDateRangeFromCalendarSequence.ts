import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { updateDateFromPickerAction } from '../actions/CaseDeadline/updateDateFromPickerAction';
import { validateSearchDeadlinesAction } from '../actions/CaseDeadline/validateSearchDeadlinesAction';

export const selectDateRangeFromCalendarSequence = [
  updateDateFromPickerAction,
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateSearchDeadlinesAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
