import { clearAlertsAction } from '../actions/clearAlertsAction';
import { initiateCourtIssuedServiceAction } from '../actions/initiateCourtIssuedServiceAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const initiateCourtIssuedServiceSequence = [
  clearAlertsAction,
  setWaitingForResponseAction,
  initiateCourtIssuedServiceAction,
  unsetWaitingForResponseAction,
];
