import { state } from 'cerebral';

export const showAppTimeoutModalHelper = (get, applicationContext) => {
  const showModalState = get(state.modal.showModal);
  const currentUser = applicationContext.getCurrentUser();
  const hasCurrentUser = !!currentUser;
  const isUploading = get(state.fileUploadProgress.isUploading);

  return {
    beginIdleMonitor: hasCurrentUser && !isUploading,
    showModal: showModalState === 'AppTimeoutModal' && hasCurrentUser,
  };
};
