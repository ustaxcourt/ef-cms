import { clearAlertsAction } from '../actions/clearAlertsAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const navigateBackSequence = [
  clearAlertsAction,
  stopShowValidationAction,
  followRedirectAction,
  {
    default: [navigateBackAction],
    success: [],
  },
];
