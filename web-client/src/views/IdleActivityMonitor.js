import { AppTimeoutModal } from './AppTimeoutModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import IdleTimer from 'react-idle-timer';
import React from 'react';

export const IdleActivityMonitor = connect(
  {
    onIdle: sequences.setIdleStatusIdleSequence,
    showModal: state.showModal,
  },
  ({ onIdle, showModal }) => {
    return (
      <div>
        <IdleTimer debounce={250} timeout={5000} onIdle={onIdle} />
        {showModal == 'AppTimeoutModal' && <AppTimeoutModal />}
      </div>
    );
  },
);
