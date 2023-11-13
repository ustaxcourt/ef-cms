import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setJudgeActivityReportFiltersAction } from '../actions/JudgeActivityReport/setJudgeActivityReportFiltersAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateJudgeActivityReportSearchAction } from '../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const setJudgeActivityReportFiltersSequence = [
  setJudgeActivityReportFiltersAction,
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
] as unknown as (props: {
  endDate?: string;
  startDate?: string;
  judgeName?: string;
}) => void;
