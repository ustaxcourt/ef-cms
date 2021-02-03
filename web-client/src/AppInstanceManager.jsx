import { BroadcastChannel } from 'broadcast-channel';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

export const AppInstanceManager = connect(
  {
    // updateIdleStatusSequence: sequences.updateIdleStatusSequence,
    broadcastIdleStatusSequence: sequences.broadcastIdleStatusSequence,
    resetIdleTimerSequence: sequences.resetIdleTimerSequence,
  },
  function AppInstanceManager({
    broadcastIdleStatusSequence,
    resetIdleTimerSequence,
    // updateIdleStatusSequence
  }) {
    // TODO: use BroadcastGateway
    const channelHandle = new BroadcastChannel('ustc-broadcast'); // TODO getConstants().CHANNEL_NAME

    /**
     * channel message object structure
     *
     * @param {object} providers the providers
     * @param {string} providers.message broadcast message
     * @param {string} providers.recipient intended recipient of message
     * @param {string} providers.subject type of message
     * @param {string} providers.threadId discussion thread ID
     */
    function ChannelMessage({ message, recipient, subject, threadId }) {
      this.threadId = threadId;
      this.recipient = recipient;
      this.sender = appInstanceId;
      this.subject = subject;
      this.message = message;
    }

    channelHandle.onmessage = msg => {
      // if (msg.recipient && msg.recipient !== appInstanceId) {
      //   return;
      // }

      //console.log('message from AppInstanceManager', msg);

      switch (msg.subject) {
        case 'idleStatusActive':
          resetIdleTimerSequence();
          break;
        case 'idleLogout':
          // updateIdleStatusSequence(msg);
          break;
        case 'idleStatusResponse': // received an idle response
          break;
        case 'idleStatus': // report our current idle status
          // todo: get current idle status through sequence return value
          broadcastIdleStatusSequence({ channelHandle });
          break;
        case 'idle': // we have become idle
          // setIdleStatusIdleSequence();
          break;
      }
    };

    const buttonClick = () => {
      console.log('ping?');
      channelHandle.postMessage(new ChannelMessage({ subject: 'ping' }));
    };

    const onSetup = () => {
      console.log("I'm setting up");
    };

    const onTeardown = () => {
      console.log("I'm tearing down");
    };

    useEffect(() => {
      onSetup();
      return onTeardown;
    }, []);
    return <button onClick={buttonClick}>This is my AIM button</button>;
  },
);
