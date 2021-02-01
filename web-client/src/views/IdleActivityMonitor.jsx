import { AppTimeoutModal } from './AppTimeoutModal';
import { BroadcastChannel } from 'broadcast-channel';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import { useIdleTimer } from 'react-idle-timer';
import React, { useEffect, useRef } from 'react';

export const IdleActivityMonitor = connect(
  {
    constants: state.constants,
    setIdleStatusActiveSequence: sequences.setIdleStatusActiveSequence,
    setIdleStatusIdleSequence: sequences.setIdleStatusIdleSequence,
    showAppTimeoutModalHelper: state.showAppTimeoutModalHelper,
  },
  function IdleActivityMonitor({
    // constants,
    setIdleStatusActiveSequence,
    setIdleStatusIdleSequence,
    showAppTimeoutModalHelper,
  }) {
    const idleTimer = useRef(null);
    const id = Math.random();
    const channelHandle = new BroadcastChannel('ustc'); // TODO getConstants().CHANNEL_NAME

    useEffect(() => {
      channelHandle.onmessage = msg => {
        console.log('incoming message', msg, id);
        switch (msg.status) {
          case 'active':
            setIdleStatusActiveSequence();
            break;
          case 'idle':
            setIdleStatusIdleSequence();
            break;
        }
      };
      console.log('I have a channel handle.', id);
      // return () => channelHandle.close();
    }, []);

    const onActive = e => {
      console.log('onActive event', e, id);
      if (channelHandle) {
        console.log('firing off active', id);
        channelHandle.postMessage({ status: 'active' });
        setIdleStatusActiveSequence();
      } else {
        console.log('no channel handle for onActive', id);
      }
    };
    const onIdle = () => {
      if (channelHandle) {
        console.log('firing off idle', id);
        channelHandle.postMessage({ status: 'idle' });
        setIdleStatusIdleSequence();
      } else {
        console.log('no channel handle for onIdle', id);
      }
    };

    if (showAppTimeoutModalHelper.beginIdleMonitor) {
      console.log('using idle timer');
      useIdleTimer({
        debounce: 250,
        onAction: onActive,
        onIdle,
        ref: idleTimer,
        timeout: 10000,
      });
    }

    return (
      <>
        {/* {showAppTimeoutModalHelper.beginIdleMonitor &&
          console.log('rendering idle timer') && (
            <IdleTimer
              debounce={constants.SESSION_DEBOUNCE}
              ref={idleTimer}
              timeout={constants.SESSION_TIMEOUT}
              onAction={e => {
                console.log("hey i'm active");
                onActive(e);
              }}
              onIdle={onIdle}
            />
          )} */}
        {showAppTimeoutModalHelper.showModal && <AppTimeoutModal />}
      </>
    );
  },
);
