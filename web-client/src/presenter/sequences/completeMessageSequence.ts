import { clearAlertsAction } from '../actions/clearAlertsAction';
import { completeMessageAction } from '../actions/CaseDetail/completeMessageAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';

export const completeMessageSequence = [
  setWaitingForResponseAction,
  clearAlertsAction,
  getMostRecentMessageInThreadAction,
  completeMessageAction,
];
