import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { getMessageThreadAction } from '../actions/getMessageThreadAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { replyToMessageAction } from '../actions/CaseDetail/replyToMessageAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setMessageAction } from '../actions/setMessageAction';
import { setMessageDetailViewerDocumentToDisplayAction } from '../actions/setMessageDetailViewerDocumentToDisplayAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCreateMessageAction } from '../actions/validateCreateMessageAction';

export const replyToMessageSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  startShowValidationAction,
  validateCreateMessageAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      replyToMessageAction,
      getMessageThreadAction,
      setMessageAction,
      getMostRecentMessageInThreadAction,
      setMessageDetailViewerDocumentToDisplayAction,
      stopShowValidationAction,
      setAlertSuccessAction,
      clearScreenMetadataAction,
      clearUsersAction,
      clearModalAction,
      clearModalStateAction,
    ]),
  },
]);
