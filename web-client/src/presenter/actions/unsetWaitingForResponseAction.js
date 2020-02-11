import { state } from 'cerebral';

/**
 * sets the state.waitingForResponse to false
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store used for setting state.waitingForResponse
 */
export const unsetWaitingForResponseAction = ({ get, store }) => {
  let requestCount = get(state.waitingForResponseRequests);

  if (requestCount > 0) {
    --requestCount;
  }

  store.set(state.waitingForResponseRequests, requestCount);
  store.set(state.waitingForResponse, requestCount > 0);
};
