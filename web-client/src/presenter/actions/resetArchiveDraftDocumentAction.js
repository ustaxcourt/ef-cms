import { state } from 'cerebral';

/**
 * clears archive draft document state properties (documentId, caseId, and documentTitle)
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const resetArchiveDraftDocumentAction = ({ store }) => {
  store.set(state.archiveDraftDocument, {
    caseId: null,
    documentId: null,
    documentTitle: null,
  });
};
