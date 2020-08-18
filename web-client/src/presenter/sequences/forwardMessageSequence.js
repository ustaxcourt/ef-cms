import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { forwardMessageAction } from '../actions/CaseDetail/forwardMessageAction';
import { getMessageThreadAction } from '../actions/getMessageThreadAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setMessageAction } from '../actions/setMessageAction';
import { setMessageDetailViewerDocumentToDisplayAction } from '../actions/setMessageDetailViewerDocumentToDisplayAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCreateMessageAction } from '../actions/validateCreateMessageAction';

export const forwardMessageSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  startShowValidationAction,
  validateCreateMessageAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      forwardMessageAction,
      getMostRecentMessageInThreadAction,
      setMessageDetailViewerDocumentToDisplayAction,
      stopShowValidationAction,
      setAlertSuccessAction,
      clearScreenMetadataAction,
      clearUsersAction,
      clearModalAction,
      clearModalStateAction,
      getMessageThreadAction,
      setMessageAction,
    ]),
  },
]);
