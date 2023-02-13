import { state } from 'cerebral';

/**
 * sets archive draft document state properties (docketEntryId, docketNumber, and documentTitle)
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props incoming cerebral props
 */
export const setArchiveDraftDocumentAction = ({ props, store }) => {
  const { docketEntryId, docketNumber, documentTitle, redirectToCaseDetail } =
    props;

  store.set(state.archiveDraftDocument, {
    docketEntryId,
    docketNumber,
    documentTitle,
    redirectToCaseDetail,
  });
};
