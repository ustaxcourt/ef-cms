import { clearFormAction } from '../actions/clearFormAction';
import { getUserAction } from '../actions/getUserAction';
import { setUserOnFormAction } from '../actions/setUserOnFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoUserContactEditSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    clearFormAction,
    getUserAction,
    setUserOnFormAction,
    setupCurrentPageAction('UserContactEdit'),
  ]);
