import { state } from 'cerebral';

/**
 * Cancels auto log-out due to inactivity.
 *
 * @param {Object} providers.get the cerebral get function to retrieve state values
 * @param {Object} providers.store the cerebral store object used for clearing alertError, alertSuccess, caseDetailErrors
 */
export const cancelAutoLogoutAction = ({ get, store }) => {
  return null;
};
