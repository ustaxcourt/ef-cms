import { AppTimeoutModal } from './AppTimeoutModal';
import { applicationContext } from '@web-client/applicationContext';
import { deleteAuthCookieInteractor } from '@shared/proxies/auth/deleteAuthCookieProxy';
import { getCurrentUserToken } from '@shared/proxies/requests';
import { useIdleTimer } from 'react-idle-timer';
import React, { useEffect, useState } from 'react';

export const IdleActivityMonitor = () => {
  const [idleModalIsOpen, setIdleModalIsOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const onPrompt = () => {
    if (getCurrentUserToken()) {
      setIdleModalIsOpen(true);
    } else {
      activate();
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

  const { activate, getRemainingTime } = useIdleTimer({
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
    leaderElection: true,
    onActive,
    onIdle,
    onPrompt,
    promptBeforeIdle: 10000,
    syncTimers: 200,
    timeout: 20000,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 100);

    return () => clearInterval(interval);
  }, [getRemainingTime]);

  return (
    <>
      <p>Remaining Time: {remainingTime}</p>
      {idleModalIsOpen && <AppTimeoutModal onConfirm={activate} />}
    </>
  );
};

IdleActivityMonitor.displayName = 'IdleActivityMonitor';
