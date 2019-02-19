import { state } from 'cerebral';

/**
 * sets the state.caseTypes based on the props.caseTypes passed in
 *
 * @param {string} page the name of the page to set
 */
export default page =>
  /**
   * sets the state.currentPage based on the scoped page
   *
   * @param {Object} providers the providers object
   * @param {Object} providers.store the cerebral store used for setting the state.currentPage
   */
  ({ store }) => {
    store.set(state.currentPage, page);
  };
