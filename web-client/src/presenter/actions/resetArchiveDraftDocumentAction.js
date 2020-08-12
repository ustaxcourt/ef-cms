import { state } from 'cerebral';

/**
 * clears archive draft document state properties (documentId, docketNumber, and documentTitle)
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const resetArchiveDraftDocumentAction = ({ store }) => {
  store.unset(state.archiveDraftDocument.docketNumber);
  store.unset(state.archiveDraftDocument.documentId);
  store.unset(state.archiveDraftDocument.documentTitle);
};
