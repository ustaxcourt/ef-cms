import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateAddDeficiencyStatisticsAction } from '../actions/validateAddDeficiencyStatisticsAction';

export const validateAddDeficiencyStatisticsSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateAddDeficiencyStatisticsAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
