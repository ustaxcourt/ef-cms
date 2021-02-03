import { AppTimeoutModal } from './AppTimeoutModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import { useIdleTimer } from 'react-idle-timer';
import React, { useEffect } from 'react';

export const IdleActivityMonitor = connect(
  {
    broadcastIdleStatusActiveSequence:
      sequences.broadcastIdleStatusActiveSequence,
    constants: state.constants,
    setIdleStatusActiveSequence: sequences.setIdleStatusActiveSequence,
    setIdleStatusIdleSequence: sequences.setIdleStatusIdleSequence,
    setIdleTimerRefSequence: sequences.setIdleTimerRefSequence,
    showAppTimeoutModalHelper: state.showAppTimeoutModalHelper,
  },
  function IdleActivityMonitor({
    broadcastIdleStatusActiveSequence,
    constants,
    setIdleStatusActiveSequence,
    setIdleStatusIdleSequence,
    setIdleTimerRefSequence,
    showAppTimeoutModalHelper,
  }) {
    let ref;
    useEffect(() => {
      setIdleTimerRefSequence({ ref });
      console.log('setting ref', ref);
    }, []);

    if (showAppTimeoutModalHelper.beginIdleMonitor) {
      ref = useIdleTimer({
        debounce: constants.SESSION_DEBOUNCE,
        onAction: broadcastIdleStatusActiveSequence,
        onIdle: setIdleStatusIdleSequence,
        timeout: constants.SESSION_TIMEOUT,
      });

      //;
    }

    // console.log('should start???');
    // if (showAppTimeoutModalHelper.beginIdleMonitor) {
    //   console.log('starting');
    // }

    // const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    //   timeout: 1000 * 60 * 15,
    //   onIdle: handleOnIdle,
    //   onActive: handleOnActive,
    //   onAction: handleOnAction,
    //   debounce: 500
    // })
    return (
      <>
        {/* {showAppTimeoutModalHelper.beginIdleMonitor && (
          <IdleTimer
            debounce={constants.SESSION_DEBOUNCE}
            timeout={constants.SESSION_TIMEOUT}
            onAction={broadcastIdleStatusActiveSequence}
            onIdle={setIdleStatusIdleSequence}
          />
        )} */}
        {showAppTimeoutModalHelper.showModal && <AppTimeoutModal />}
      </>
    );
  },
);
