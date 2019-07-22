import { state } from 'cerebral';

/**
 * Sets the caseDetailPage.informationTab view.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting workQueueToDisplay
 * @param {object} providers.props.tab the tab to display
 */
export const setCaseDetailPageTabAction = ({ props, store }) => {
  store.set(state.caseDetailPage.informationTab, props.tab);
};
