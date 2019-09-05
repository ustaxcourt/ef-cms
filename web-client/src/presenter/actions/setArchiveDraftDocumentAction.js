import { state } from 'cerebral';

/**
 * sets archive draft document state properties (documentId, caseId, and documentTitle)
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props incoming cerebral props
 */
export const setArchiveDraftDocumentAction = ({ props, store }) => {
  const { caseId, documentId, documentTitle } = props;

  store.set(state.archiveDraftDocument, {
    caseId,
    documentId,
    documentTitle,
  });
};
