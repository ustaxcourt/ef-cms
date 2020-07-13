import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { forwardCaseMessageAction } from '../actions/CaseDetail/forwardCaseMessageAction';
import { getMessageThreadAction } from '../actions/getMessageThreadAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setMessageAction } from '../actions/setMessageAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCreateCaseMessageAction } from '../actions/validateCreateCaseMessageAction';

export const forwardCaseMessageSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  startShowValidationAction,
  validateCreateCaseMessageAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      forwardCaseMessageAction,
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
