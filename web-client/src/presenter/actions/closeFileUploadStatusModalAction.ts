import { state } from '@web-client/presenter/app.cerebral';

export const closeFileUploadStatusModalAction = async ({
  store,
  get,
}: ActionProps) => {
  store.set(state.fileUploadProgress.percentComplete, 100);
  store.set(state.fileUploadProgress.timeRemaining, 0);
  store.set(state.fileUploadProgress.isUploading, false);
  await new Promise(resolve => {
    setTimeout(resolve, process.env.FILE_UPLOAD_MODAL_TIMEOUT || 3000);
  });
  if (get(state.modal.showModal === 'FileUploadStatusModal')) {
    store.set(state.modal.showModal, '');
  }
};
