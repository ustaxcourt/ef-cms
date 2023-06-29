import { state } from '@web-client/presenter/app.cerebral';

/**
 * unset state.batchDownloads
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetBatchDownloadsAction = ({ store }: ActionProps) => {
  store.unset(state.batchDownloads);
};
