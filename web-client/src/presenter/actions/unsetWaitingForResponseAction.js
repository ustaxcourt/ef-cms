import { state } from 'cerebral';

/**
 * sets the state.waitingForResponse to false
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.waitingForResponse
 */
export const unsetWaitingForResponseAction = ({ store }) => {
  store.set(state.waitingForResponse, false);
};
