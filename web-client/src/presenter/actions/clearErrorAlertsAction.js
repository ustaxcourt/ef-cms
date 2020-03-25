import { state } from 'cerebral';

/**
 * Clears any error alerts.
 * state.alertError is used for displaying the red alert at the top of the page.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing alertError
 */
export const clearErrorAlertsAction = ({ store }) => {
  store.unset(state.alertError);
};
