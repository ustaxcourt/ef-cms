import { state } from 'cerebral';

/**
 * Sets the documentDetail.tab view.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for setting workQueueToDisplay
 * @param {Object} providers.props.tab the tab to display
 * @returns {*} returns the next action in the sequence's path
 */
export const setDocumentDetailTabAction = ({ store, props }) => {
  store.set(state.documentDetail.tab, props.tab);
};
