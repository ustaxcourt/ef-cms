import { state } from 'cerebral';

/**
 * clears the viewerDocumentToDisplay from state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const clearViewerDocumentToDisplayAction = ({ props, store }) => {
  if (props.tabName === 'documentView') {
    store.unset(state.viewerDocumentToDisplay);
    store.unset(state.iframeSrc);
  }
};
