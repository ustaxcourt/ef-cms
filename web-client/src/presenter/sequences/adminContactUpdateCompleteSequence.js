import { getUserContactEditCompleteAlertSuccessAction } from '../actions/getUserContactEditCompleteAlertSuccessAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';
import { unsetUserContactEditProgressAction } from '../actions/unsetUserContactEditProgressAction';

export const adminContactUpdateCompleteSequence = [
  stopWebSocketConnectionAction,
  unsetUserContactEditProgressAction,
  getUserContactEditCompleteAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
];
