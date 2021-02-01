import { AppTimeoutModal } from './AppTimeoutModal';
import { BroadcastChannel } from 'broadcast-channel';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import IdleTimer from 'react-idle-timer';
import React, { useEffect, useRef } from 'react';

export const IdleActivityMonitor = connect(
  {
    constants: state.constants,
    setIdleStatusActiveSequence: sequences.setIdleStatusActiveSequence,
    setIdleStatusIdleSequence: sequences.setIdleStatusIdleSequence,
    showAppTimeoutModalHelper: state.showAppTimeoutModalHelper,
  },
  function IdleActivityMonitor({
    constants,
    setIdleStatusActiveSequence,
    setIdleStatusIdleSequence,
    showAppTimeoutModalHelper,
  }) {
    const idleTimer = useRef(null);
    let channelHandle;
    useEffect(() => {
      channelHandle = new BroadcastChannel('ustc'); // TODO getConstants().CHANNEL_NAME
      channelHandle.onmessage = msg => console.log(msg);
      console.log('I have a channel handle.');
      return () => channelHandle.close();
    }, []);
    const onActive = () => {
      channelHandle.postMessage('what up dawg');
      setIdleStatusActiveSequence();
    };
    const onIdle = () => {
      channelHandle.postMessage('zzzz');
      setIdleStatusIdleSequence();
    };

    return (
      <>
        {showAppTimeoutModalHelper.beginIdleMonitor && (
          <IdleTimer
            debounce={constants.SESSION_DEBOUNCE}
            ref={idleTimer}
            timeout={constants.SESSION_TIMEOUT}
            onActive={onActive}
            onIdle={onIdle}
          />
        )}
        {showAppTimeoutModalHelper.showModal && <AppTimeoutModal />}
      </>
    );
  },
);
