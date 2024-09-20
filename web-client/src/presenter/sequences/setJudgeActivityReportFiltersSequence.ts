import { clearAlertsAction } from '../actions/clearAlertsAction';
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
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
] as unknown as (props: {
  endDate?: string;
  startDate?: string;
  judgeName?: string;
}) => void;
