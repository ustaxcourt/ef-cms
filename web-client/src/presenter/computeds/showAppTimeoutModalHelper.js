import { state } from 'cerebral';

export const showAppTimeoutModalHelper = get => {
  const showModalState = get(state.showModal);
  const currentUser = get(state.user);
  const hasCurrentUser = !!currentUser;
  const isUploading = get(state.isUploading);

  return {
    beginIdleMonitor: hasCurrentUser && !isUploading,
    showModal: showModalState === 'AppTimeoutModal' && hasCurrentUser,
  };
};
