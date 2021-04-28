import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

const focusableChildren =
  'h1[tabindex], h2[tabindex], h3[tabindex], .focusable[tabindex]';

export const Focus = ({ children, className }) => {
  const [focused, setFocused] = useState(false);
  const node = useRef(null);

  const setFocus = e => {
    e && e.preventDefault();
    const focusEl = node.current.querySelector(focusableChildren);
    if (focusEl && focusEl.focus) focusEl.focus();
    setFocused(true);
    return false;
  };

  useEffect(() => {
    focused || setFocus();
  }, []);

  const focusClassName = classNames('focus-component', className);
  const child = (
    <div className={focusClassName} ref={node}>
      {children}
    </div>
  );
  return child;
};
