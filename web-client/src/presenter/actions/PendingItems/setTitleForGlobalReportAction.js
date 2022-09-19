import { state } from 'cerebral';

/**
 * Sets the title for the screen
 *
 * @param {string} headerTitle the name of the header title
 * @returns {Promise} async action
 */
export const setTitleForGlobalReportAction =
  headerTitle =>
  /**
   * sets the state.currentPage based on the scoped page
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store used for setting the state.currentPage
   */
  ({ store }) => {
    store.set(state.screenMetadata.headerTitle, headerTitle);
  };
