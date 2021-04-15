import { state } from 'cerebral';

/**
 * sets the state.form with an empty contact object
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setDefaultAddPetitionerToCaseFormAction = ({ store }) => {
  store.set(state.form, { contact: {} });
};
