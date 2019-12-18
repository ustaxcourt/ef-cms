import { state } from 'cerebral';

/**
 * sets the state.caseTypes based on the props.caseTypes passed in
 *
 * @param {string} page the name of the page to set
 * @returns {Promise} async action
 */
export const setCurrentPageAction = page =>
  /**
   * sets the state.currentPage based on the scoped page
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store used for setting the state.currentPage
   */
  async ({ store }) => {
    store.set(state.currentPage, page);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  };
