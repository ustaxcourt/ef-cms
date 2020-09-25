import { state } from 'cerebral';

/**
 * calls the proxy/interactor to clear a docketEntryId for focus override
 *
 * @param {object} providers.store the cerebral store object
 * @returns {Promise} async action
 */
export const clearDraftDocumentViewerDocketEntryIdAction = async ({
  store,
}) => {
  store.unset(state.draftDocumentViewerDocketEntryId);
};
