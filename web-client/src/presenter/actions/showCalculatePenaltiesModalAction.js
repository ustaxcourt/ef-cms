import { state } from 'cerebral';

/**
 * shows the calculate penalties modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const showCalculatePenaltiesModalAction = ({ store }) => {
  store.set(state.modal.showModal, 'CalculatePenaltiesModal');
};
