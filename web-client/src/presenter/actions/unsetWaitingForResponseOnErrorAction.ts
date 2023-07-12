import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.progressIndicator.waitingForResponse to false and state.progressIndicator.waitingForResponseRequests to zero
 * NOTE: you should probably call this action only on an application exception, since it
 * ceases to show any progress indicators even if some had been pending.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.progressIndicator.waitingForResponse
 */
export const unsetWaitingForResponseOnErrorAction = ({
  store,
}: ActionProps) => {
  store.set(state.progressIndicator.waitingForResponseRequests, 0);
  store.set(state.progressIndicator.waitingForResponse, false);
};
