import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { skipSigningOrderForMessageAction } from '../actions/skipSigningOrderForMessageAction';

export const skipSigningOrderForMessageSequence = [
  skipSigningOrderForMessageAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToPathAction,
];
