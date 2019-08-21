import { state } from 'cerebral';

/**
 * Closes the reports menu
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting isReportsMenuOpen
 */
export const closeReportsMenuAction = ({ store }) => {
  store.set(state.isReportsMenuOpen, false);
};
