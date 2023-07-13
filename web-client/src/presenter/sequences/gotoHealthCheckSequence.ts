import { getHealthCheckAction } from '../actions/getHealthCheckAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setHealthCheckAction } from '../actions/setHealthCheckAction';

export const gotoHealthCheckSequence = [
  getHealthCheckAction,
  setHealthCheckAction,
  setCurrentPageAction('HealthCheck'),
];
