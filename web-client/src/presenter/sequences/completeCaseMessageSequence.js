import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { completeCaseMessageAction } from '../actions/CaseDetail/completeCaseMessageAction';
import { getMessageThreadAction } from '../actions/getMessageThreadAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setMessageAction } from '../actions/setMessageAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const completeCaseMessageSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  getMostRecentMessageInThreadAction,
  completeCaseMessageAction,
  setAlertSuccessAction,
  clearScreenMetadataAction,
  clearUsersAction,
  clearModalAction,
  clearModalStateAction,
  getMessageThreadAction,
  setMessageAction,
]);
