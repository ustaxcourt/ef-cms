import { state } from 'cerebral';

/**
 * calls the proxy/interactor to clear a docketEntryId for focus override
 * @param {object} providers.store the cerebral store object
 */
export const clearDraftDocumentViewerDocketEntryIdAction = ({
  store,
}: ActionProps) => {
  store.unset(state.draftDocumentViewerDocketEntryId);
};
