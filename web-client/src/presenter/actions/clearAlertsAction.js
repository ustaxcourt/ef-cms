import { state } from 'cerebral';

/**
 * Clears any and all alerts that might be enabled.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral get function to retrieve state values
 * @param {Object} providers.store the cerebral store object used for clearing alertError, alertSuccess, caseDetailErrors
 */
export const clearAlertsAction = ({ get, store }) => {
  const saveAlerts = get(state.saveAlertsForNavigation);
  if (!saveAlerts) {
    store.set(state.alertError, null);
    store.set(state.alertSuccess, null);
  }

  store.set(state.caseDetailErrors, {});
  store.set(state.saveAlertsForNavigation, false);
  store.set(state.validationErrors, {});
};
