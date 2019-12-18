import 'wicg-inert';
import React, { useEffect, useRef } from 'react';

const appRoot = document.getElementById('app');
const tabbableSelector =
  'a:enabled,button:enabled,input:enabled,select:enabled,textarea:enabled';

export const FocusLock = ({ children }) => {
  const el = useRef(null);

  const onKey = event => {
    if (event.keyCode != 9 || !el.current.contains(event.target)) {
      // not tab key on element within this component
      return;
    }
    const lockedElements = el.current.querySelectorAll(tabbableSelector);
    const [firstTabbable, lastTabbable] = [
      lockedElements.item(0),
      lockedElements.item(lockedElements.length - 1),
    ];
    if (event.target == firstTabbable && event.shiftKey) {
      // shift-tab when on firstTabbable: move focus to lastTabbable
      lastTabbable.focus();
      event.preventDefault();
      return false;
    }
    if (event.target == lastTabbable && !event.shiftKey) {
      // tab (without shift) when on lastTabbable: move focus to firstTabbable
      firstTabbable.focus();
      event.preventDefault();
      return false;
    }
    return true;
  };

  useEffect(() => {
    appRoot.inert = true; // leverages wicg-inert polyfill
    appRoot.setAttribute('aria-hidden', 'true');
    document.addEventListener('keydown', onKey);

    return () => {
      appRoot.inert = false;
      appRoot.setAttribute('aria-hidden', 'false');
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="ustc-focus-lock" ref={el}>
      {children}
    </div>
  );
};
