import { followRedirectAction } from '../actions/followRedirectAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { skipSigningOrderAction } from '../actions/skipSigningOrderAction';

export const skipSigningOrderSequence = [
  skipSigningOrderAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  followRedirectAction,
  { default: navigateToPathAction, success: [] },
];
