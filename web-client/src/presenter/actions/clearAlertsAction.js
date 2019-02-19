import { state } from 'cerebral';

/**
 * Clears any and all alerts that might be enabled.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing alertError, alertSuccess, caseDetailErrors
 */
export default ({ store }) => {
  store.set(state.alertError, null);
  store.set(state.alertSuccess, null);
  store.set(state.caseDetailErrors, {});
};
