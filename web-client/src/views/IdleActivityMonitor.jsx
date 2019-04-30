import { AppTimeoutModal } from './AppTimeoutModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import IdleTimer from 'react-idle-timer';
import React from 'react';

export const IdleActivityMonitor = connect(
  {
    constants: state.constants,
    currentUser: state.user,
    debounce: state.debounce,
    onIdle: sequences.setIdleStatusIdleSequence,
    showModal: state.showModal,
  },
  ({ currentUser, onIdle, showModal, constants }) => {
    return (
      <>
        {currentUser && (
          <IdleTimer
            debounce={constants.SESSION_DEBOUNCE}
            timeout={constants.SESSION_TIMEOUT}
            onIdle={onIdle}
          />
        )}
        {showModal == 'AppTimeoutModal' && !!currentUser && <AppTimeoutModal />}
      </>
    );
  },
);
