import { followRedirectAction } from '../actions/followRedirectAction';
import { getPaperServiceSuccessMessageAction } from '../actions/getPaperServiceSuccessMessageAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';

export const navigateToCaseDetailFromPaperServiceSequence = [
  setSaveAlertsForNavigationAction,
  getPaperServiceSuccessMessageAction,
  setAlertSuccessAction,
  followRedirectAction,
  {
    default: [navigateToCaseDetailAction],
    success: [],
  },
];
