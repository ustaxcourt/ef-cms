import { FocusLock } from '../../ustc-ui/FocusLock/FocusLock';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const modalRoot = window.document.getElementById('modal-root');

export const BaseModal = ({
  children,
  className,
  title,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const elRef = React.useRef(null);

  const getEl = () => {
    if (!elRef.current) {
      elRef.current = window.document.createElement('div');
    }
    return elRef.current;
  };

  useEffect(() => {
    const toggleNoScroll = scrollingOn => {
      if (scrollingOn) {
        window.document.body.classList.add('no-scroll');
      } else {
        window.document.body.classList.remove('no-scroll');
      }
    };

    modalRoot.appendChild(getEl());
    toggleNoScroll(true);

    return () => {
      modalRoot.removeChild(getEl());
      toggleNoScroll(false);
    };
  }, []);

  const renderModalContent = () => {
    return (
      <FocusLock>
        <dialog
          open
          aria-modal="true"
          className={classNames('modal-screen', className)}
          role="dialog"
          title={title}
        >
          <div className="modal-dialog padding-205">{children}</div>
        </dialog>
      </FocusLock>
    );
  };

  return ReactDOM.createPortal(renderModalContent(), getEl());
};

BaseModal.displayName = 'BaseModal';
