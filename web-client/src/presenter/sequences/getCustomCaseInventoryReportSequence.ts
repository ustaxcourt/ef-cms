import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCustomCaseInventoryReportAction } from '../actions/CaseInventoryReport/getCustomCaseInventoryReportAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateCustomInventoryFiltersAction } from '../actions/validateCustomInventoryFiltersAction';

export const getCustomCaseInventoryReportSequence = [
  setWaitingForResponseAction,
  startShowValidationAction,
  validateCustomInventoryFiltersAction,
  {
    error: [setAlertErrorAction, setValidationErrorsAction],
    success: [
      stopShowValidationAction,
      clearErrorAlertsAction,
      clearAlertsAction,
      getCustomCaseInventoryReportAction,
    ],
  },
  unsetWaitingForResponseAction,
] as unknown as (props: { selectedPage: number }) => void;
