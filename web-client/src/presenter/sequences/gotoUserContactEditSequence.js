import { clearFormAction } from '../actions/clearFormAction';
import { getUserAction } from '../actions/getUserAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setUserOnFormAction } from '../actions/setUserOnFormAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoUserContactEditSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    clearFormAction,
    getUserAction,
    setUserOnFormAction,
    setCurrentPageAction('UserContactEdit'),
  ]);
