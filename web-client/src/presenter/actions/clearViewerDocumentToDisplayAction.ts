import { state } from 'cerebral';

/**
 * Clears the viewerDocumentToDisplay from state
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const clearViewerDocumentToDisplayAction = ({ store }: ActionProps) => {
  store.unset(state.viewerDocumentToDisplay);
  store.unset(state.iframeSrc);
};
