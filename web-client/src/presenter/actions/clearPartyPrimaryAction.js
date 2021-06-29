import { state } from 'cerebral';

/**
 * clears state.form.partyPrimary
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 */
export const clearPartyPrimaryAction = ({ store }) => {
  store.unset(state.form.partyPrimary);
};
