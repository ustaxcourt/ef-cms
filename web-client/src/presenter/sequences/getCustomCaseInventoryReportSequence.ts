import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCustomCaseInventoryReportAction } from '../actions/CaseInventoryReport/getCustomCaseInventoryReportAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCustomInventoryFiltersAction } from '../actions/validateCustomInventoryFiltersAction';

export const getCustomCaseInventoryReportSequence =
  showProgressSequenceDecorator([
    startShowValidationAction,
    validateCustomInventoryFiltersAction,
    {
      error: [setValidationErrorsAction],
      success: [
        stopShowValidationAction,
        clearErrorAlertsAction,
        clearAlertsAction,
        getCustomCaseInventoryReportAction,
      ],
    },
  ]);
