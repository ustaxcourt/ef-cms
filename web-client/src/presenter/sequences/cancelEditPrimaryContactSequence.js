import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';

export const cancelEditPrimaryContactSequence = [
  clearErrorAlertsAction,
  navigateToCaseDetailAction,
];
