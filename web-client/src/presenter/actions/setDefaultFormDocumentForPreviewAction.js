import { state } from 'cerebral';

/**
 * sets a default for state.currentViewMetadata.documentSelectedForPreview if not already set
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setDefaultFormDocumentForPreviewAction = ({ get, store }) => {
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
