import { clearAlertsAction } from '../actions/clearAlertsAction';
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
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
