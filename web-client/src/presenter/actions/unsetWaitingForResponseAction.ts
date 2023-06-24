import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.progressIndicator.waitingForResponse to false
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store used for setting state.progressIndicator.waitingForResponse
 */
export const unsetWaitingForResponseAction = ({ get, store }: ActionProps) => {
  let requestCount = get(state.progressIndicator.waitingForResponseRequests);

  if (requestCount > 0) {
    --requestCount;
  }

  store.set(state.progressIndicator.waitingForResponseRequests, requestCount);
  store.set(state.progressIndicator.waitingForResponse, requestCount > 0);
  store.unset(state.progressIndicator.waitText);
};
