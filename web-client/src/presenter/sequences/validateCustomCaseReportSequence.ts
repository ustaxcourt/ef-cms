import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '@web-client/presenter/actions/shouldValidateAction';
import { validateCustomCaseReportFiltersAction } from '@web-client/presenter/actions/validateCustomCaseReportFiltersAction';

export const validateCustomCaseReportSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCustomCaseReportFiltersAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
] as unknown as (props: { selectedPage: number }) => void;
