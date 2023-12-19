import { clearModalAction } from '../actions/clearModalAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { unsetWaitingForResponseOnErrorAction } from '../actions/unsetWaitingForResponseOnErrorAction';

export const unauthorizedErrorSequence = [
  unsetWaitingForResponseOnErrorAction,
  clearModalAction,
  navigateToLoginSequence,
];
