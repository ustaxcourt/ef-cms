import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AppInstanceManager = connect(
  {
    appInstanceManagerHelper: state.appInstanceManagerHelper,
    confirmStayLoggedInSequence: sequences.confirmStayLoggedInSequence,
    resetIdleTimerSequence: sequences.resetIdleTimerSequence,
  },
  function AppInstanceManager({
    appInstanceManagerHelper,
    confirmStayLoggedInSequence,
    resetIdleTimerSequence,
  }) {
    const { channelHandle } = appInstanceManagerHelper;

    console.log('channelHandle', channelHandle);

    // TODO: stay logged in stopped working unexpectedly for current tab
    // TODO: refresh (idleactivitymonitor) needed to render timer

    channelHandle.onmessage = ({ data: msg }) => {
      switch (msg.subject) {
        case 'idleStatusActive':
          resetIdleTimerSequence();
          break;
        case 'stayLoggedIn':
          confirmStayLoggedInSequence();
          break;
        case 'idleLogout':
          // TODO: new story for sync'd logout
          break;
      }
    };

    return <></>;
  },
);
