import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the currentViewMetadata.caseDetail.primaryTab view.
 *
 * @param {string} tab the tab to display
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
