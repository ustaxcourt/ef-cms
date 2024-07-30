import { Get } from 'cerebral';
import { IDLE_LOGOUT_STATES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const showAppTimeoutModalHelper = (get: Get): any => {
  const modalState = get(state.idleLogoutState.state);
  const currentUser = get(state.user);

  return {
    currentUser,
    showModal:
      !!currentUser?.userId && modalState === IDLE_LOGOUT_STATES.COUNTDOWN,
  };
};
