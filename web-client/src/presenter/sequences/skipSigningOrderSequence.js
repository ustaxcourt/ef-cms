import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { skipSigningOrderAction } from '../actions/skipSigningOrderAction';

export const skipSigningOrderSequence = [
  skipSigningOrderAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToPathAction,
];
