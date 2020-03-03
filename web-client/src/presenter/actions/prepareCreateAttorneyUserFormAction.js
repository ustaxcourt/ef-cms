import { state } from 'cerebral';

/**
 * prepare the form state to create a new attorney user
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store
 */
export const prepareCreateAttorneyUserFormAction = ({ store }) => {
  store.set(state.form, { contact: {} });
};
