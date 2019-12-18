import { state } from 'cerebral';

export const showAppTimeoutModalHelper = (get, applicationContext) => {
  const showModalState = get(state.showModal);
  const currentUser = applicationContext.getCurrentUser();
  const hasCurrentUser = !!currentUser;
  const isUploading = get(state.isUploading);

  return {
    beginIdleMonitor: hasCurrentUser && !isUploading,
    showModal: showModalState === 'AppTimeoutModal' && hasCurrentUser,
  };
};
