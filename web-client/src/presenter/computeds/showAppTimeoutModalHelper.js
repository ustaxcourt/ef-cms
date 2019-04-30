import { state } from 'cerebral';

export const showAppTimeoutModalHelper = get => {
  const showModalState = get(state.showModal);
  const currentUser = get(state.user);

  return {
    showModal: showModalState === 'AppTimeoutModal' && !!currentUser,
  };
};
