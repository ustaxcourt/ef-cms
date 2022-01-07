import { state } from 'cerebral';

/**
 * resets the document upload value in state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const resetAddCorrespondenceAction = ({ store }) => {
  store.set(state.currentViewMetadata.documentUploadMode, 'scan');
  store.set(
    state.currentViewMetadata.documentSelectedForScan,
    'primaryDocumentFile',
  );
};
