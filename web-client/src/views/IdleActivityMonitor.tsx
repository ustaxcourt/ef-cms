import { AppTimeoutModal } from './AppTimeoutModal';
import { applicationContext } from '@web-client/applicationContext';
import { deleteAuthCookieInteractor } from '@shared/proxies/auth/deleteAuthCookieProxy';
import { getCurrentUserToken } from '@shared/proxies/requests';
import { useIdleTimer } from 'react-idle-timer';
import React, { useEffect, useState } from 'react';

type IdleLogoutTesting = {
  idleActivityMonitor?: {
    isInTestingMode?: boolean;
    sessionTimeout?: number;
    areYouStillThereTime?: number;
  };
};

export const IdleActivityMonitor = () => {
  const defaultSessionTimeout = 55 * 60 * 1000;
  const defaultAreYouStillThereTime = 5 * 60 * 1000;

  const [idleModalIsOpen, setIdleModalIsOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isInTestingMode, setIsInTestingMode] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(defaultSessionTimeout);
  const [areYouStillThereTime, setAreYouStillThereTime] = useState(
    defaultAreYouStillThereTime,
  );

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

  const onAction = () => {
    if (!getCurrentUserToken()) {
      activate();
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
    onAction,
    onActive,
    onIdle,
    onPrompt,
    promptBeforeIdle: areYouStillThereTime,
    syncTimers: 200,
    timeout: sessionTimeout,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (process.env.ENV !== 'prod') {
      interval = setInterval(() => {
        setIsInTestingMode(
          (window as unknown as IdleLogoutTesting)?.idleActivityMonitor
            ?.isInTestingMode || false,
        );
        setSessionTimeout(
          (window as unknown as IdleLogoutTesting)?.idleActivityMonitor
            ?.sessionTimeout || defaultSessionTimeout,
        );
        setAreYouStillThereTime(
          (window as unknown as IdleLogoutTesting)?.idleActivityMonitor
            ?.areYouStillThereTime || defaultAreYouStillThereTime,
        );
        setRemainingTime(getRemainingTime());
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [getRemainingTime]);

  return (
    <>
      {isInTestingMode && <p>Time Before Logout: {remainingTime}</p>}
      {idleModalIsOpen && <AppTimeoutModal onConfirm={activate} />}
    </>
  );
};

IdleActivityMonitor.displayName = 'IdleActivityMonitor';
