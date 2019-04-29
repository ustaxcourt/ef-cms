import { state } from 'cerebral';

/**
 * sets the timeout values
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the applicationContext used for the getUniqueId method
 * @param {Object} providers.store the cerebral store used for setting state.workQueue
 * @returns {undefined}
 */
export const setTimeoutValuesAction = ({ applicationContext, store }) => {
  store.set(state.timeout, applicationContext.getTimeout());
  store.set(state.debounce, applicationContext.getDebounce());
};
