import { clearAlertsAction } from '../actions/clearAlertsAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocumentSelectedForPreviewAction } from '../actions/unsetDocumentSelectedForPreviewAction';

export const navigateBackSequence = [
  clearAlertsAction,
  unsetDocumentSelectedForPreviewAction,
  stopShowValidationAction,
  followRedirectAction,
  {
    default: [navigateBackAction],
    success: [],
  },
];
