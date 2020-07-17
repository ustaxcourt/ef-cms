import { clearAlertsAction } from '../actions/clearAlertsAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getHasAlternateBackLocationAction } from '../actions/getHasAlternateBackLocationAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const navigateBackSequence = [
  clearAlertsAction,
  stopShowValidationAction,
  followRedirectAction,
  {
    default: [
      getHasAlternateBackLocationAction, // TODO: For refactor - could probably use the redirect implementation instead (see noticeGenerationCompleteSequence)
      {
        false: [navigateBackAction],
        true: [navigateToPathAction],
      },
    ],
    success: [],
  },
];
