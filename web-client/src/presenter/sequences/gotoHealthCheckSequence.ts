import { getHealthCheckAction } from '../actions/getHealthCheckAction';
import { setHealthCheckAction } from '../actions/setHealthCheckAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoHealthCheckSequence = [
  getHealthCheckAction,
  setHealthCheckAction,
  setupCurrentPageAction('HealthCheck'),
];
