import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';

export const navigateToPathAndSetRedirectUrlSequence = [
  clearErrorAlertsAction,
  setRedirectUrlAction,
  navigateToPathAction,
];
