import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearOptionalFieldsStampFormAction } from '../actions/StampMotion/clearOptionalFieldsStampFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const clearOptionalFieldsStampFormSequence = [
  stopShowValidationAction,
  clearAlertsAction,
  clearErrorAlertsAction,
  clearOptionalFieldsStampFormAction,
];
