import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears archive draft document state properties (docketEntryId, docketNumber, and documentTitle)
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const resetArchiveDraftDocumentAction = ({ store }: ActionProps) => {
  store.unset(state.archiveDraftDocument.docketNumber);
  store.unset(state.archiveDraftDocument.docketEntryId);
  store.unset(state.archiveDraftDocument.documentTitle);
};
