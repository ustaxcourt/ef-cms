import { AppTimeoutModal } from './AppTimeoutModal';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
    setIdleStatusIdleSequence,
    setIdleTimerRefSequence,
    showAppTimeoutModalHelper,
  }) {
    const ref = useIdleTimer({
      debounce: constants.SESSION_DEBOUNCE,
      onAction: broadcastIdleStatusActiveSequence,
      onIdle: setIdleStatusIdleSequence,
      timeout: constants.SESSION_TIMEOUT,
    });

    useEffect(() => {
      if (showAppTimeoutModalHelper.beginIdleMonitor) {
        setIdleTimerRefSequence({ ref });
      }
    }, [showAppTimeoutModalHelper.beginIdleMonitor]);

    return <>{showAppTimeoutModalHelper.showModal && <AppTimeoutModal />}</>;
  },
);

IdleActivityMonitor.displayName = 'IdleActivityMonitor';
