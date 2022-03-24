import { getTrialSessionsByStatusAction } from '../actions/TrialSession/getTrialSessionsByStatusAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const getTrialSessionByStatusSequence =
  startWebSocketConnectionSequenceDecorator([
    getTrialSessionsByStatusAction,
    setTrialSessionsAction,
  ]);
