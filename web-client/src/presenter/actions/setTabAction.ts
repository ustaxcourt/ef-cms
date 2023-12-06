import { state } from '@web-client/presenter/app.cerebral';
/**
 *  returns a callback function that sets tab on state
 * @param {string} tab the value of tab to be set
 * @returns {Function} returns a callback function that sets tab on state
 */
export const setTabAction =
  tab =>
  /**
   * sets the value of state.currentViewMetadata.tab entry to the value passed in
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store object
   */
  ({ store }: ActionProps) => {
    store.set(state.currentViewMetadata.tab, tab);
  };
