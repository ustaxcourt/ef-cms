import { clearAlertsAction } from '../actions/clearAlertsAction';
import { initiateServiceAction } from '../actions/initiateServiceAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const initiateServiceSequence = [
  clearAlertsAction,
  setWaitingForResponseAction,
  initiateServiceAction,
  unsetWaitingForResponseAction,
];
