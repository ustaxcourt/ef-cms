import { AppTimeoutModal } from './AppTimeoutModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import IdleTimer from 'react-idle-timer';
import React from 'react';

export const IdleActivityMonitor = connect(
  {
    currentUser: state.user,
    debounce: state.debounce,
    onIdle: sequences.setIdleStatusIdleSequence,
    showModal: state.showModal,
    timeout: state.timeout,
  },
  ({ currentUser, onIdle, showModal, timeout, debounce }) => {
    return (
      <>
        {currentUser && (
          <IdleTimer debounce={debounce} timeout={timeout} onIdle={onIdle} />
        )}
        {showModal == 'AppTimeoutModal' && !!currentUser && <AppTimeoutModal />}
      </>
    );
  },
);
