// import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getHasAlternateBackLocationAction } from '../actions/getHasAlternateBackLocationAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
// import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const navigateBackFromPrintPreviewSequence = [
  // setSaveAlertsForNavigationAction,
  // clearAlertsAction,
  stopShowValidationAction,
  getHasAlternateBackLocationAction,
  {
    false: [navigateBackAction],
    true: [navigateToPathAction],
  },
];
