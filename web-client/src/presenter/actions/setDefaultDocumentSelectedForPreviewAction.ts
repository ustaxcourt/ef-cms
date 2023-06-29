import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets a default for state.currentViewMetadata.documentSelectedForPreview if not already set
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setDefaultDocumentSelectedForPreviewAction = ({
  get,
  store,
}: ActionProps) => {
  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );

  if (!documentSelectedForPreview) {
    store.set(
      state.currentViewMetadata.documentSelectedForPreview,
      'petitionFile',
    );
  }
};
