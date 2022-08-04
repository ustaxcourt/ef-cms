import { state } from 'cerebral';
/**
 * TODO fix this
 * gets the first attachment document from the most recent message to set as the default messageViewerDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} object containing messageViewerDocumentToDisplay
 */
export const unsetSelectedDocketEntryToDisplayAction = ({ store }) => {
  store.unset(state.documentId);
};
