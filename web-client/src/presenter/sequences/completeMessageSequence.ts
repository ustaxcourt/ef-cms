import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { completeMessageAction } from '../actions/CaseDetail/completeMessageAction';
import { getMessageThreadAction } from '../actions/getMessageThreadAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { setMessageAction } from '../actions/setMessageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const completeMessageSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  getMostRecentMessageInThreadAction,
  completeMessageAction,
  clearScreenMetadataAction,
  clearUsersAction,
  clearModalAction,
  clearModalStateAction,
  getMessageThreadAction,
  setMessageAction,
]);
