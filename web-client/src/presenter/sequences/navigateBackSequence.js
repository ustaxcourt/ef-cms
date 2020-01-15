import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getHasAlternateBackLocationAction } from '../actions/getHasAlternateBackLocationAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const navigateBackSequence = [
  clearAlertsAction,
  stopShowValidationAction,
  getHasAlternateBackLocationAction,
  {
    false: [navigateBackAction],
    true: [navigateToPathAction],
  },
];
