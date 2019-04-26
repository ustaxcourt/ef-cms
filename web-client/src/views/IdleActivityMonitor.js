import { AppTimeoutModal } from './AppTimeoutModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import IdleTimer from 'react-idle-timer';
import React from 'react';

export const IdleActivityMonitor = connect(
  {
    currentUser: state.user,
    onIdle: sequences.setIdleStatusIdleSequence,
    showModal: state.showModal,
  },
  ({ currentUser, onIdle, showModal }) => {
    return (
      <div>
        {currentUser && (
          <IdleTimer debounce={250} timeout={5000} onIdle={onIdle} />
        )}
        {showModal == 'AppTimeoutModal' && !!currentUser && <AppTimeoutModal />}
      </div>
    );
  },
);
