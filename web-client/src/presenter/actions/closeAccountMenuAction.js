import { state } from 'cerebral';

/**
 * Closes the account menu
 *
 * @param {Object} providers the providers object
<<<<<<< HEAD
 * @param {Object} providers.store the cerebral store object
=======
 * @param {Object} providers.store the cerebral store object used for setting isAccountMenuOpen
>>>>>>> develop
 */
export const closeAccountMenuAction = ({ store }) => {
  store.set(state.isAccountMenuOpen, false);
};
