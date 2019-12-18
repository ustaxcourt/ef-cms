import { Button } from '../ustc-ui/Button/Button';
import { FocusLock } from '../ustc-ui/FocusLock/FocusLock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const modalRoot = document.getElementById('modal-root');

export const ModalDialog = ({
  ariaLiveMode,
  cancelLabel,
  cancelSequence,
  children,
  className,
  confirmLabel,
  confirmSequence,
  message,
  preventCancelOnBlur,
  preventScrolling,
  title,
}) => {
  preventCancelOnBlur = !!preventCancelOnBlur;
  preventScrolling = preventScrolling !== undefined ? preventScrolling : true;

  const elRef = useRef(null);

  const getEl = () => {
    if (!elRef.current) {
      elRef.current = document.createElement('div');
    }
    return elRef.current;
  };

  const toggleNoScroll = scrollingOn => {
    if (preventScrolling && scrollingOn) {
      document.body.classList.add('no-scroll');
      document.addEventListener('touchmove', touchmoveTriggered, {
        passive: false,
      });
    } else {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('touchmove', touchmoveTriggered, {
        passive: false,
      });
    }
  };

  const runCancelSequence = event => {
    event.stopPropagation();
    cancelSequence.call();
  };

  const runConfirmSequence = event => {
    event.stopPropagation();
    confirmSequence.call();
  };

  const keydownTriggered = event => {
    if (event.keyCode === 27) {
      return blurDialog(event);
    }
  };

  const touchmoveTriggered = event => {
    return event.preventDefault();
  };

  const blurDialog = event => {
    if (preventCancelOnBlur) {
      return false;
    }
    return runCancelSequence(event);
  };

  useEffect(() => {
    modalRoot.appendChild(getEl());
    document.addEventListener('keydown', keydownTriggered, false);
    toggleNoScroll(true);

    return () => {
      modalRoot.removeChild(getEl());
      document.removeEventListener('keydown', keydownTriggered, false);
      toggleNoScroll(false);
    };
  }, []);

  const renderModalContent = () => {
    return (
      <FocusLock>
        <dialog
          open
          className="modal-screen"
          role="dialog"
          onClick={blurDialog}
        >
          <div
            aria-live={ariaLiveMode || 'assertive'}
            aria-modal="true"
            className={classNames('modal-dialog padding-205', className)}
            role="status"
            onClick={event => event.stopPropagation()}
          >
            <div className="modal-header grid-container padding-x-0">
              <div className="grid-row">
                <div className="mobile-lg:grid-col-9">
                  <h3 className="modal-header__title" tabIndex="-1">
                    {title}
                  </h3>
                </div>
                <div className="mobile-lg:grid-col-3">
                  <Button
                    link
                    className="text-no-underline hide-on-mobile float-right margin-right-0 padding-top-0"
                    onClick={runCancelSequence}
                  >
                    Close
                    <FontAwesomeIcon
                      className="margin-right-0 margin-left-1"
                      icon="times-circle"
                    />
                  </Button>
                </div>
              </div>
            </div>
            {message && <p className="margin-bottom-5">{message}</p>}
            {children}
            <div className="margin-top-2">
              <Button onClick={runConfirmSequence}>{confirmLabel}</Button>
              {cancelLabel && (
                <Button secondary onClick={runCancelSequence}>
                  {cancelLabel}
                </Button>
              )}
            </div>
          </div>
        </dialog>
      </FocusLock>
    );
  };

  return ReactDOM.createPortal(renderModalContent(), getEl());
};
