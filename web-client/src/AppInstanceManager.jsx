import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

/**
 * AppInstanceManager
 *
 * A component which lives in the app as a singleton, and monitors
 * communications from other instances of the app (i.e. other windows
 * or tabs also open to the same domain/path) and takes appropriate
 * action according to the message subject received. Currently
 * it monitors idle time activity and coordinates "I am active" messages
 * and "I am still here" messages.
 */
export const AppInstanceManager = connect(
  {
    appInstanceManagerHelper: state.appInstanceManagerHelper,
    broadcastRefreshTokenSequence: sequences.broadcastRefreshTokenSequence,
    confirmStayLoggedInSequence: sequences.confirmStayLoggedInSequence,
    resetIdleTimerSequence: sequences.resetIdleTimerSequence,
    saveRefreshTokenSequence: sequences.saveRefreshTokenSequence,
  },
  function AppInstanceManager({
    appInstanceManagerHelper,
    broadcastRefreshTokenSequence,
    confirmStayLoggedInSequence,
    resetIdleTimerSequence,
    saveRefreshTokenSequence,
  }) {
    const { channelHandle } = appInstanceManagerHelper;

    console.log('overwrite onmessage');
    channelHandle.onmessage = msg => {
      console.log('channelHandle.onmessage', msg);
      switch (msg.subject) {
        case 'idleStatusActive':
          resetIdleTimerSequence();
          break;
        case 'stayLoggedIn':
          confirmStayLoggedInSequence();
          break;
        case 'receiveToken':
          saveRefreshTokenSequence(msg);
          break;
        case 'requestToken':
          broadcastRefreshTokenSequence();
          break;
      }
    };

    return <></>;
  },
);
