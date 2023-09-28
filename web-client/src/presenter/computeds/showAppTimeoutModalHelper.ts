import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const showAppTimeoutModalHelper = (get: Get) => {
  const modalState = get(state.idleLogoutState.state);
  const currentUser = get(state.user);
  const hasCurrentUser = !!currentUser;
  const isUploading = get(state.fileUploadProgress.isUploading);

  return {
    beginIdleMonitor: hasCurrentUser && !isUploading,
    currentUser,
    showModal: modalState === 'COUNTDOWN',
  };
};
