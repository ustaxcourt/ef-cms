import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
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
 * and "I am still here" messages, as well as "DAWSON has been updated,
 * please refresh" messages.
 */
export const AppInstanceManager = connect(
  {
    appInstanceManagerHelper: state.appInstanceManagerHelper,
    confirmStayLoggedInSequence: sequences.confirmStayLoggedInSequence,
    handleAppHasUpdatedSequence: sequences.handleAppHasUpdatedSequence,
    resetIdleTimerSequence: sequences.resetIdleTimerSequence,
    signOutIdleSequence: sequences.signOutIdleSequence,
    signOutUserInitiatedSequence: sequences.signOutUserInitiatedSequence,
  },
  function AppInstanceManager({
    appInstanceManagerHelper,
    confirmStayLoggedInSequence,
    handleAppHasUpdatedSequence,
    resetIdleTimerSequence,
    signOutIdleSequence,
    signOutUserInitiatedSequence,
  }) {
    const { channelHandle } = appInstanceManagerHelper;

    channelHandle.onmessage = msg => {
      switch (msg.subject) {
        case BROADCAST_MESSAGES.idleStatusActive:
          resetIdleTimerSequence();
          break;
        case BROADCAST_MESSAGES.stayLoggedIn:
          confirmStayLoggedInSequence();
          break;
        case BROADCAST_MESSAGES.idleLogout:
          signOutIdleSequence({
            skipBroadcast: true,
          });
          break;
        case BROADCAST_MESSAGES.userLogout:
          signOutUserInitiatedSequence({
            skipBroadcast: true,
          });
          break;
        case BROADCAST_MESSAGES.appHasUpdated:
          handleAppHasUpdatedSequence({ skipBroadcast: true });
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
