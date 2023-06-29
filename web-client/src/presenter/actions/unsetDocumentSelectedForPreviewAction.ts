import { state } from '@web-client/presenter/app.cerebral';

/**
 * Unsets state.currentViewMetadata.documentSelectedForPreview
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetDocumentSelectedForPreviewAction = ({
  store,
}: ActionProps) => {
  store.unset(state.currentViewMetadata.documentSelectedForPreview);
};
