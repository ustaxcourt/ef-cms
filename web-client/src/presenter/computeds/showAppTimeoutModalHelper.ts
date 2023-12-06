import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const showAppTimeoutModalHelper = (get: Get): any => {
  const modalState = get(state.idleLogoutState.state);
  const currentUser = get(state.user);

  return {
    currentUser,
    showModal: modalState === 'COUNTDOWN',
  };
};
