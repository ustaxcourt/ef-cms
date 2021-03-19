import { state } from 'cerebral';

/**
 * unset state.batchDownloads
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetBatchDownloadsAction = ({ store }) => {
  store.unset(state.batchDownloads);
};
