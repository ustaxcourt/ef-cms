import 'wicg-inert';
import React, { useEffect, useRef } from 'react';

const appRoot =
  window.document.getElementById('app') ||
  window.document.getElementById('app-public');
const tabbableSelector =
  'a:enabled,button:enabled,input:enabled,select:enabled,textarea:enabled,h1[tabindex],h2[tabindex],h3[tabindex],h4[tabindex],.focusable[tabindex]';

export const FocusLock = ({ children }) => {
  const el = useRef(null);

  const previousElementWithFocus =
    (window.document.hasFocus() &&
      window.document.activeElement !== window.document.body &&
      window.document.activeElement !== window.document.documentElement &&
      window.document.activeElement) ||
    {};

  const getLockedTabbables = () => {
    const lockedElements = el.current.querySelectorAll(tabbableSelector);
    return {
      first: lockedElements.item(0),
      last: lockedElements.item(lockedElements.length - 1),
    };
  };

  const onKey = event => {
    if (event.keyCode != 9 || !el.current.contains(event.target)) {
      // not tab key on element within this component
      return;
    }
    const tabbables = getLockedTabbables();
    if (event.target == tabbables.first && event.shiftKey) {
      // shift-tab when on firstTabbable: move focus to lastTabbable
      tabbables.last.focus();
      event.preventDefault();
      return false;
    }
    if (event.target == tabbables.last && !event.shiftKey) {
      // tab (without shift) when on lastTabbable: move focus to firstTabbable
      tabbables.first.focus();
      event.preventDefault();
      return false;
    }
    return true;
  };

  useEffect(() => {
    appRoot.inert = true; // leverages wicg-inert polyfill
    appRoot.setAttribute('aria-hidden', 'true');
    window.document.addEventListener('keydown', onKey);
    getLockedTabbables().first.focus();

    return () => {
      appRoot.inert = false;
      appRoot.setAttribute('aria-hidden', 'false');
      window.document.removeEventListener('keydown', onKey);
      previousElementWithFocus.focus && previousElementWithFocus.focus();
    };
  }, []);

  return (
    <div className="ustc-focus-lock" ref={el}>
      {children}
    </div>
  );
};

FocusLock.displayName = 'FocusLock';
