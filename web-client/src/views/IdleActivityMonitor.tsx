import { AppTimeoutModal } from './AppTimeoutModal';
import { applicationContext } from '@web-client/applicationContext';
import { deleteAuthCookieInteractor } from '@shared/proxies/auth/deleteAuthCookieProxy';
import { getCurrentUserToken } from '@shared/proxies/requests';
import { useIdleTimer } from 'react-idle-timer';
import React, { useState } from 'react';

export const IdleActivityMonitor = () => {
  const [idleModalIsOpen, setIdleModalIsOpen] = useState(false);

  const onPrompt = () => {
    if (getCurrentUserToken()) {
      setIdleModalIsOpen(true);
    }
  };

  const onIdle = async () => {
    if (getCurrentUserToken()) {
      setIdleModalIsOpen(false);
      try {
        await deleteAuthCookieInteractor(applicationContext);
      } catch (e) {
        console.error('Error deleting auth cookie on idle', e);
      }
      window.location.href = '/idle-logout';
    }
  };

  const onActive = () => {
    setIdleModalIsOpen(false);
  };

  const { activate } = useIdleTimer({
    crossTab: true,
    debounce: 500,
    events: [
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove',
    ],
    eventsThrottle: 200,
    name: 'idle-timer',
    onActive,
    onIdle,
    onPrompt,
    promptBeforeIdle: 10000,
    syncTimers: 500,
    throttle: 0,
    timeout: 20000,
  });

  return <>{idleModalIsOpen && <AppTimeoutModal onConfirm={activate} />}</>;
};

IdleActivityMonitor.displayName = 'IdleActivityMonitor';
