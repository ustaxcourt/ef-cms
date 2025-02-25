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
    handleAppHasUpdatedSequence: sequences.handleAppHasUpdatedSequence,
    signOutUserInitiatedSequence: sequences.signOutUserInitiatedSequence,
    token: state.token,
  },
  function AppInstanceManager({
    appInstanceManagerHelper,
    handleAppHasUpdatedSequence,
    signOutUserInitiatedSequence,
    token,
  }) {
    const { channelHandle } = appInstanceManagerHelper;

    channelHandle.onmessage = msg => {
      switch (msg.subject) {
        case BROADCAST_MESSAGES.userLogout:
          if (token) {
            signOutUserInitiatedSequence({
              skipBroadcast: true,
            });
          }
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
