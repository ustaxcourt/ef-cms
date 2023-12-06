import { state } from '@web-client/presenter/app.cerebral';

/**
 * closes the mobile menu
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const closeMobileMenuAction = ({ store }: ActionProps) => {
  store.set(state.header.showMobileMenu, false);
};
