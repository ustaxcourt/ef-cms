import { state } from 'cerebral';

/**
 * closes the mobile menu
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const closeMobileMenuAction = ({ store }) => {
  store.set(state.header.showMobileMenu, false);
};
