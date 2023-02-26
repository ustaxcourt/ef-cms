import { clearModalAction } from '../actions/clearModalAction';
import { isSearchTimeoutErrorAction } from '../actions/isSearchTimeoutErrorAction';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { setSearchTimeoutAlertAction } from '../actions/setSearchTimeoutAlertAction';
import { unsetWaitingForResponseOnErrorAction } from '../actions/unsetWaitingForResponseOnErrorAction';

export const gatewayTimeoutErrorSequence = [
  unsetWaitingForResponseOnErrorAction,
  isSearchTimeoutErrorAction,
  {
    no: [setAlertFromExceptionAction],
    yes: [setSearchTimeoutAlertAction],
  },
  clearModalAction,
];
