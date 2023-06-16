import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.progressIndicator.waitingForResponse to true which is used for showing the document upload or spinner
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.progressIndicator.waitingForResponse
 */
export const setWaitingForResponseAction = ({ store }: ActionProps) => {
  store.increment(state.progressIndicator.waitingForResponseRequests);
  store.set(state.progressIndicator.waitingForResponse, true);
};
