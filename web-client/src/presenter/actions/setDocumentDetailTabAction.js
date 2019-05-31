import { state } from 'cerebral';

/**
 * Sets the documentDetail.tab view.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting workQueueToDisplay
 * @param {object} providers.props.tab the tab to display
 */
export const setDocumentDetailTabAction = ({ store, props }) => {
  store.set(state.documentDetail.tab, props.tab);
};
