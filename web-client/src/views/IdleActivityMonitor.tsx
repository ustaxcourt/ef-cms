import { AppTimeoutModal } from './AppTimeoutModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { useIdleTimer } from 'react-idle-timer';
import React, { useEffect } from 'react';

export const IdleActivityMonitor = connect(
  {
    broadcastIdleStatusActiveSequence:
      sequences.broadcastIdleStatusActiveSequence,
    constants: state.constants,
    handleIdleLogoutSequence: sequences.handleIdleLogoutSequence,
    lastIdleAction: state.lastIdleAction,
    showAppTimeoutModalHelper: state.showAppTimeoutModalHelper,
    user: state.user,
  },
  function IdleActivityMonitor({
    broadcastIdleStatusActiveSequence,
    constants,
    handleIdleLogoutSequence,
    lastIdleAction,
    showAppTimeoutModalHelper,
  }) {
    useIdleTimer({
      debounce: constants.SESSION_DEBOUNCE,
      // eslint-disable-next-line spellcheck/spell-checker
      // we do not want 'visibilitychange', so we override the defaults
      events: [
        'mousemove',
        'keydown',
        'wheel',
        'DOMMouseScroll',
        'mousewheel',
        'mousedown',
        'touchstart',
        'touchmove',
        'MSPointerDown',
        'MSPointerMove',
      ],
      onAction: broadcastIdleStatusActiveSequence,
    });

    useEffect(() => {
      const interval = setInterval(() => {
        handleIdleLogoutSequence();
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }, [lastIdleAction]);

    return <>{showAppTimeoutModalHelper.showModal && <AppTimeoutModal />}</>;
  },
);

IdleActivityMonitor.displayName = 'IdleActivityMonitor';
