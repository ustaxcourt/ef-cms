import { clearAlertsAction } from '../actions/clearAlertsAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getSavePetitionForLaterServiceAlertSuccessAction } from '../actions/getSavePetitionForLaterServiceAlertSuccessAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const leaveCaseForLaterServiceSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  getSavePetitionForLaterServiceAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  followRedirectAction,
  {
    default: [navigateToDocumentQCAction],
    success: [],
  },
]);
