import { state } from '@web-client/presenter/app.cerebral';

/**
 * Clears any and all alerts that might be enabled.
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object used for clearing alertError, alertSuccess
 */
export const clearAlertsAction = ({ get, props, store }: ActionProps) => {
  const saveAlerts = get(state.saveAlertsForNavigation);
  if (!saveAlerts) {
    store.unset(state.alertError);
    store.unset(state.alertSuccess);
    store.unset(state.alertWarning);
  }
  store.set(state.saveAlertsForNavigation, false);
  if (props.fromModal) {
    store.set(state.modal.validationErrors, {});
  } else {
    store.set(state.validationErrors, {});
  }
};
