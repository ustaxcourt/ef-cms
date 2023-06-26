import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the currentViewMetadata.documentDetail.tab view.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting workQueueToDisplay
 * @param {object} providers.props.tab the tab to display
 */
export const setDocumentDetailTabAction = ({ props, store }: ActionProps) => {
  store.set(state.currentViewMetadata.documentDetail.tab, props.tab);
};
