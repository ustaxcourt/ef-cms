import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the penalties confirmation message on state to an empty object.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const clearConfirmationTextForCalculatePenaltiesModalAction = ({
  store,
}: ActionProps) => {
  store.set(state.confirmationText.penalties, {});
};
