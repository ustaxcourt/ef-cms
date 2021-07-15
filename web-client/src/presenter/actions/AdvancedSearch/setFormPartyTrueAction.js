import { state } from 'cerebral';
/**
 *  returns a callback function that sets form[party] to true on state
 *
 * @param {string} party the party on the form to be set to true
 * @returns {Function} returns a callback function that sets form[party] to true
 */
export const setFormPartyTrueAction =
  party =>
  /**
   * sets the value of state.form[party] to true
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store object
   */
  ({ store }) => {
    store.set(state.form[party], true);
  };
