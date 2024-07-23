import { Get } from 'cerebral';
import { LOGOUT_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const showAppTimeoutModalHelper = (get: Get): any => {
  const modalState = get(state.idleLogoutState.state);
  const currentUser = get(state.user);

  return {
    currentUser,
    showModal: modalState === LOGOUT_OPTIONS.idleLogoutStates.COUNTDOWN,
  };
};
