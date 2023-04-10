import { state } from 'cerebral';

/**
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting showModal
 * @returns {Promise} async action
 */
export const closeFileUploadStatusModalAction = async ({ get, store }) => {
  console.log('enter closeFileUploadStatusModalAction');

  store.set(state.fileUploadProgress.percentComplete, 100);
  store.set(state.fileUploadProgress.timeRemaining, 0);
  store.set(state.fileUploadProgress.isUploading, false);
  console.log('upload progress', get(state.fileUploadProgress));

  await new Promise(resolve => {
    console.log('resolve', resolve);

    setTimeout(resolve, process.env.FILE_UPLOAD_MODAL_TIMEOUT || 3000);
  });
  store.set(state.modal.showModal, '');
};
