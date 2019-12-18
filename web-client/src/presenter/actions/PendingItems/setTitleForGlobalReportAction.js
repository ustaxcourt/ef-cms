import { state } from 'cerebral';

/**
 * Sets the title for the screen
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting pendingItems
 * @param {object} providers.props the pendingItems to set
 */
export const setTitleForGlobalReportAction = ({ store }) => {
  store.set(state.screenMetadata.headerTitle, 'Pending Report');
};
