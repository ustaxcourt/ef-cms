import { state } from '@web-client/presenter/app.cerebral';

/**
 * unset state.batchDownloads.zipInProgress
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetBatchDownloadsZipInProgessAction = ({
  store,
}: ActionProps) => {
  store.unset(state.batchDownloads.zipInProgress);
};
