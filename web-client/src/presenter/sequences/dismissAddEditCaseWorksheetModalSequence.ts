import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const dismissAddEditCaseWorksheetModalSequence = [
  stopShowValidationAction,
  clearFormAction,
  clearAlertsAction,
  clearModalAction,
  clearModalStateAction,
];
