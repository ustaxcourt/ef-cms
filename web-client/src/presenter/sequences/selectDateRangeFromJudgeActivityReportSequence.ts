import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { updateDateFromPickerFromFormAction } from '../actions/JudgeActivityReport/updateDateFromPickerFromFormAction';
import { validateJudgeActivityReportSearchAction } from '../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const selectDateRangeFromJudgeActivityReportSequence = [
  updateDateFromPickerFromFormAction,
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateJudgeActivityReportSearchAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [clearAlertsAction],
      },
    ],
  },
];
