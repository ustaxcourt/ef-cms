import { BroadcastChannel } from 'broadcast-channel';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

export const AppInstanceManager = ({ appInstanceId }) => {
  const channelHandle = new BroadcastChannel('ustc'); // TODO getConstants().CHANNEL_NAME

  /**
   *
   */
  function ChannelMessage({ message, recipient, subject, threadId }) {
    this.threadId = threadId;
    this.recipient = recipient;
    this.sender = appInstanceId;
    this.subject = subject;
    this.message = message;
  }

  channelHandle.onmessage = msg => {
    if (msg.to && msg.to !== appInstanceId) {
      return;
    }
    switch (msg.topic) {
      case 'idleLogout':
        updateIdleStatusSequence(msg);
        break;
      case 'idle':
        // setIdleStatusIdleSequence();
        break;
    }
  };

  const buttonClick = () => {
    console.log('ping?');
    channelHandle.postMessage(new ChannelMessage({ topic: 'ping' }));
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
};
