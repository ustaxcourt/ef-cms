import { state } from 'cerebral';

export const showAppTimeoutModalHelper = (get, applicationContext) => {
  const appTimeoutModalName = 'AppTimeoutModal';
  //let modalShowingRemotely = false;

  // get any remote instances and their states
  // const appInstances = get(state.appInstances);

  // if (appInstances?.length) {
  //   appInstances.some(instance => {
  //     // TODO 7501 - do we need to consider if the user is logged in for the other instance?
  //     if (instance.showModal && instance.showModal === appTimeoutModalName) {
  //       // TODO 7501 - use the state.appInstances to look for a showAppTimeoutModal: true condition
  //       modalShowingRemotely = true;
  //       return true;
  //     }
  //   });
  // }

  // TODO 7501 - probably won't need to fetch the showModalState anymore
  const showModalState = get(state.modal.showModal);
  const currentUser = applicationContext.getCurrentUser();
  const hasCurrentUser = !!currentUser;
  const isUploading = get(state.fileUploadProgress.isUploading);

  // const modalShowingInThisOrOtherInstance =
  //   modalShowingRemotely || showModalState === appTimeoutModalName;

  return {
    beginIdleMonitor: hasCurrentUser && !isUploading,
    currentUser,
    showModal: showModalState === appTimeoutModalName && hasCurrentUser,
  };
};
