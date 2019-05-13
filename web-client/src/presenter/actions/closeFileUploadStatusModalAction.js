import { state } from 'cerebral';

/**
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for setting showModal
 */
export const closeFileUploadStatusModalAction = async ({ store }) => {
  await new Promise(resolve => {
    store.set(state.percentComplete, 100);
    store.set(state.timeRemaining, 0);
    store.set(state.isUploading, false);
    setTimeout(resolve, 3000);
  }).then(() => {
    store.set(state.showModal, '');
  });
};
