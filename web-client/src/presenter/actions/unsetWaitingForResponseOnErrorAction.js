import { state } from 'cerebral';

/**
 * sets the state.waitingForResponse to false and state.waitingForResponseRequests to zero
 * NOTE: you should probably call this action only on an application exception, since it
 * ceases to show any progress indicators even if some had been pending.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.waitingForResponse
 */
export const unsetWaitingForResponseOnErrorAction = ({ store }) => {
  store.set(state.waitingForResponseRequests, 0);
  store.set(state.waitingForResponse, false);
};
