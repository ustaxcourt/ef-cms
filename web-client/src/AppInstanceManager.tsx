import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
    confirmStayLoggedInSequence: sequences.confirmStayLoggedInSequence,
    resetIdleTimerSequence: sequences.resetIdleTimerSequence,
    signOutSequence: sequences.signOutSequence,
  },
  function AppInstanceManager({
    appInstanceManagerHelper,
    confirmStayLoggedInSequence,
    resetIdleTimerSequence,
    signOutSequence,
  }) {
    const { channelHandle } = appInstanceManagerHelper;

    channelHandle.onmessage = msg => {
      switch (msg.subject) {
        case 'idleStatusActive':
          resetIdleTimerSequence();
          break;
        case 'stayLoggedIn':
          confirmStayLoggedInSequence();
          break;
        case 'logout':
          signOutSequence({
            skipBroadcast: true,
          });
          break;
        default:
          console.warn('unhandled broadcast event', msg);
          break;
      }
    };

    return <></>;
  },
);

AppInstanceManager.displayName = 'AppInstanceManager';
