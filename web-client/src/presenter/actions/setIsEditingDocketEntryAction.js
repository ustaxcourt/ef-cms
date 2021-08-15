import { state } from 'cerebral';
/**
 *  returns a callback function that sets isEditingDocketEntry on state
 *
 * @param {string} isEditingDocketEntry the value of isEditingDocketEntry to be set
 * @returns {Function} returns a callback function that sets isEditingDocketEntry on state
 */
export const setIsEditingDocketEntryAction =
  isEditingDocketEntry =>
  /**
   * sets the value of state.isEditingDocket entry to the value passed in
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store object
   */
  ({ store }) => {
    store.set(state.isEditingDocketEntry, isEditingDocketEntry);
  };
