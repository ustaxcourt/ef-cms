import { state } from 'cerebral';

/**
 * sets the penalties confirmation message on state to an empty array.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const clearConfirmationTextForCalculatePenaltiesModalAction = ({
  store,
}) => {
  store.set(state.confirmationText.penalties, []);
};
