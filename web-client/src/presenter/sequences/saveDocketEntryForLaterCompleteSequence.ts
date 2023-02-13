import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const saveDocketEntryForLaterCompleteSequence = [
  clearModalAction,
  unsetWaitingForResponseAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToCaseDetailAction,
];
