import { state } from 'cerebral';

export const showAppTimeoutModalHelper = (get, applicationContext) => {
  const appTimeoutModalName = 'AppTimeoutModal';
  let modalShowingRemotely = false;

  // get any remote instances and their states
  const remoteInstances = get(state.remoteInstances);

  if (remoteInstances?.length) {
    remoteInstances.some(instance => {
      // TODO - 7501 do we need to consider if the user is logged in for the other instance?
      if (instance.showModal && instance.showModal === appTimeoutModalName) {
        modalShowingRemotely = true;
        return true;
      }
    });
  }

  const showModalState = get(state.modal.showModal);
  const currentUser = applicationContext.getCurrentUser();
  const hasCurrentUser = !!currentUser;
  const isUploading = get(state.fileUploadProgress.isUploading);

  const modalShowingInThisOrOtherInstance =
    modalShowingRemotely || showModalState === appTimeoutModalName;

  return {
    beginIdleMonitor: hasCurrentUser && !isUploading,
    showModal: modalShowingInThisOrOtherInstance && hasCurrentUser,
  };
};
