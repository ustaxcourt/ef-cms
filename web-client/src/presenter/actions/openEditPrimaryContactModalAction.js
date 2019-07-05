import { state } from 'cerebral';

/**
 * opens edit primary contact modal
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.showModal
 * @returns {void}
 */
export const openEditPrimaryContactModalAction = async ({ store }) => {
  store.set(state.showModal, 'EditPrimaryContact');
};
