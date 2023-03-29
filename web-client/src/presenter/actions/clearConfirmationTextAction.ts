import { state } from 'cerebral';

/**
 * resets the state.confirmationText which is used to display a confirmation message.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 */
export const clearConfirmationTextAction = ({ store }) => {
  store.unset(state.confirmationText);
};
