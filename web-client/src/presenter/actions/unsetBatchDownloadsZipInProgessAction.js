import { state } from 'cerebral';

/**
 * unset state.batchDownloads.zipInProgress
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetBatchDownloadsZipInProgessAction = ({ store }) => {
  store.unset(state.batchDownloads.zipInProgress);
};
