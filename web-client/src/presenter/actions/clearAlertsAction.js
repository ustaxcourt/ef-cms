import { state } from 'cerebral';

/**
 * Clears any and all alerts that might be enabled.
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.store the cerebral store object used for clearing alertError, alertSuccess, caseDetailErrors
 */
export const clearAlertsAction = ({ get, store }) => {
  const saveAlerts = get(state.saveAlertsForNavigation);
  if (!saveAlerts) {
    store.unset(state.alertError);
    store.unset(state.alertSuccess);
  }
  store.set(state.form.searchError, false);
  store.set(state.caseDetailErrors, {});
  store.set(state.saveAlertsForNavigation, false);
  store.set(state.validationErrors, {});
};
