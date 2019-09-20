import { AppTimeoutModal } from './AppTimeoutModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import IdleTimer from 'react-idle-timer';
import React from 'react';

export const IdleActivityMonitor = connect(
  {
    constants: state.constants,
    setIdleStatusIdleSequence: sequences.setIdleStatusIdleSequence,
    showAppTimeoutModalHelper: state.showAppTimeoutModalHelper,
  },
  ({ constants, setIdleStatusIdleSequence, showAppTimeoutModalHelper }) => {
    return (
      <>
        {showAppTimeoutModalHelper.beginIdleMonitor && (
          <IdleTimer
            debounce={constants.SESSION_DEBOUNCE}
            timeout={constants.SESSION_TIMEOUT}
            onIdle={setIdleStatusIdleSequence}
          />
        )}
        {showAppTimeoutModalHelper.showModal && <AppTimeoutModal />}
      </>
    );
  },
);
