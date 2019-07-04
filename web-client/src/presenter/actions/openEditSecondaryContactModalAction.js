import { state } from 'cerebral';

/**
 * opens edit secondary contact modal
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.showModal
 * @returns {void}
 */
export const openEditSecondaryContactModalAction = async ({ store }) => {
  store.set(state.showModal, 'EditSecondaryContact');
};
