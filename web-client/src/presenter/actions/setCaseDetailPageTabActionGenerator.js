import { state } from 'cerebral';

/**
 * Sets the currentViewMetadata.caseDetail.primaryTab view.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting workQueueToDisplay
 * @param {object} providers.props.tab the tab to display
 * @returns {Function} a function that sets the tab name
 */
export const setCaseDetailPageTabActionGenerator = tab => {
  return ({ props, store }) => {
    const tabName = tab || props.tab;
    if (props.isSecondary) {
      store.set(
        state.currentViewMetadata.caseDetail.primaryTab,
        'caseInformation',
      );
      store.set(
        state.currentViewMetadata.caseDetail.caseInformationTab,
        tabName,
      );
    } else {
      store.set(state.currentViewMetadata.caseDetail.primaryTab, tabName);
    }
  };
};
