import { state } from 'cerebral';

export const showAppTimeoutModalHelper = get => {
  const showModalState = get(state.showModal);
  const currentUser = get(state.user);
  const hasCurrentUser = !!currentUser;

  return {
    beginIdleMonitor: hasCurrentUser,
    showModal: showModalState === 'AppTimeoutModal' && hasCurrentUser,
  };
};
