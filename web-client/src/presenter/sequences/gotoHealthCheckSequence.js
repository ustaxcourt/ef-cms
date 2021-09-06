import { getHealthCheckAction } from '../actions/getHealthCheckAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setHealthCheckAction } from '../actions/setHealthCheckAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoHealthCheckSequence =
  startWebSocketConnectionSequenceDecorator([
    getHealthCheckAction,
    setHealthCheckAction,
    setCurrentPageAction('HealthCheck'),
  ]);
