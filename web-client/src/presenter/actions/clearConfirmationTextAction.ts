import { state } from '@web-client/presenter/app.cerebral';

/**
 * unsets the confirmationText object from state.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 */
export const clearConfirmationTextAction = ({ store }: ActionProps) => {
  store.unset(state.confirmationText);
};
