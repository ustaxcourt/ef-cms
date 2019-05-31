import { state } from 'cerebral';

/**
 * sets the state.baseUrl based on the base url provided in the application context.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.baseUrl
 * @param {object} providers.applicationContext the application context which provides the getBaseUrl function
 */
export const setBaseUrlAction = ({ store, applicationContext }) => {
  store.set(state.baseUrl, applicationContext.getBaseUrl());
};
