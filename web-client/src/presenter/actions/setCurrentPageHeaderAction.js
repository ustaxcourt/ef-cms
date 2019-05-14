import { state } from 'cerebral';

/**
 * sets the state.currentPage based on the props.currentPage passed in
 *
 * @param {string} pageHeader the name of the page header to set
 */
export const setCurrentPageHeaderAction = pageHeader =>
  /**
   * sets the state.currentPage based on the scoped page
   *
   * @param {Object} providers the providers object
   * @param {Object} providers.store the cerebral store used for setting the state.currentPage
   */
  ({ store }) => {
    store.set(state.currentPageHeader, pageHeader);
  };
