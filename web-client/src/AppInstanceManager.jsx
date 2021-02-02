import { BroadcastChannel } from 'broadcast-channel';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

export const AppInstanceManager = connect(
  {
    // updateIdleStatusSequence: sequences.updateIdleStatusSequence,
    // broadcastIdleStatusSequence: sequences.broadcastIdleStatusSequence,
  },
  function AppInstanceManager(
    {
      // broadcastIdleStatusSequence,
      // updateIdleStatusSequence
    },
  ) {
    // TODO: use BroadcastGateway
    const channelHandle = new BroadcastChannel('ustc'); // TODO getConstants().CHANNEL_NAME

    /**
     * channel message object structure
     *
     * @param {object} providers
     * @param {string} providers.message
     * @param {string} providers.recipient
     * @param {string} providers.subject
     * @param {string} providers.threadId
     */
    function ChannelMessage({ message, recipient, subject, threadId }) {
      this.threadId = threadId;
      this.recipient = recipient;
      this.sender = appInstanceId;
      this.subject = subject;
      this.message = message;
    }

    channelHandle.onmessage = msg => {
      if (msg.recipient && msg.recipient !== appInstanceId) {
        return;
      }

      switch (msg.subject) {
        case 'idleLogout':
          // updateIdleStatusSequence(msg);
          break;
        case 'idleStatus':
          // todo: get current idle status through sequence return value
          // broadcastIdleStatusSequence();
          break;
        case 'idle':
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
