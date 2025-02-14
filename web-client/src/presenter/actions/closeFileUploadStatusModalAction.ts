import { state } from '@web-client/presenter/app.cerebral';

export const closeFileUploadStatusModalAction = async ({
  applicationContext,
  store,
  get,
}: ActionProps) => {
  store.set(state.fileUploadProgress.percentComplete, 100);
  store.set(state.fileUploadProgress.timeRemaining, 0);
  store.set(state.fileUploadProgress.isUploading, false);

  const TIMEOUT: number = process.env.FILE_UPLOAD_MODAL_TIMEOUT
    ? +process.env.FILE_UPLOAD_MODAL_TIMEOUT
    : 3000;

  await applicationContext.getUtilities().sleep(TIMEOUT);

  if (get(state.modal.showModal) === 'FileUploadStatusModal') {
    store.set(state.modal.showModal, '');
  }
};
