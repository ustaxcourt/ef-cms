import { Button } from '../ustc-ui/Button/Button';
import { FocusLock } from '../ustc-ui/FocusLock/FocusLock';
import React, { ReactNode, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const modalRoot = window.document.getElementById('modal-root');

export const ModalDialog = ({
  cancelLabel,
  cancelLink = false,
  cancelSequence,
  children,
  className,
  closeLink = true,
  confirmHref,
  confirmLabel,
  confirmSequence,
  confirmTarget = '_self',
  disableSubmit = false,
  message,
  messageClass = 'margin-bottom-5',
  preventCancelOnBlur,
  preventScrolling,
  showButtons = true,
  title,
  useRunConfirmSequence = false,
}: {
  cancelLabel?: string;
  cancelLink?: boolean;
  messageClass?: string;
  cancelSequence: any;
  children?: ReactNode;
  className?: string;
  closeLink?: boolean;
  confirmHref?: string;
  confirmLabel?: string;
  confirmSequence: any;
  confirmTarget?: string;
  disableSubmit?: boolean;
  message?: string;
  preventCancelOnBlur?: boolean;
  preventScrolling?: boolean;
  showButtons?: boolean;
  title: string;
  useRunConfirmSequence?: boolean;
}) => {
  preventCancelOnBlur = !!preventCancelOnBlur;
  preventScrolling = preventScrolling !== undefined ? preventScrolling : true;

  const elRef = useRef(null);

  const getEl = () => {
    if (!elRef.current) {
      elRef.current = window.document.createElement('div');
    }
    return elRef.current;
  };

  const toggleNoScroll = scrollingOn => {
    if (preventScrolling && scrollingOn) {
      window.document.body.classList.add('no-scroll');
      window.document.addEventListener('touchmove', touchmoveTriggered, {
        passive: false,
      });
    } else {
      window.document.body.classList.remove('no-scroll');
      window.document.removeEventListener('touchmove', touchmoveTriggered, {
        passive: false,
      });
    }
  };

  const runCancelSequence = evt => {
    evt.stopPropagation();
    cancelSequence.call();
  };

  const runConfirmSequence = evt => {
    evt.stopPropagation();
    confirmSequence.call();
  };

  const keydownTriggered = evt => {
    if (evt.keyCode === 27) {
      return blurDialog(evt);
    }
  };

  const touchmoveTriggered = evt => {
    return evt.preventDefault();
  };

  const blurDialog = evt => {
    if (preventCancelOnBlur) {
      return;
    }
    return runCancelSequence(evt);
  };

  useEffect(() => {
    modalRoot.appendChild(getEl());
    window.document.addEventListener('keydown', keydownTriggered, false);
    toggleNoScroll(true);

    return () => {
      modalRoot.removeChild(getEl());
      window.document.removeEventListener('keydown', keydownTriggered, false);
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
            aria-modal="true"
            className={classNames('modal-dialog padding-205', className)}
            onClick={evt => evt.stopPropagation()}
          >
            <div className="modal-header grid-container padding-x-0">
              <div className="grid-row">
                <div className="mobile-lg:grid-col-9">
                  {title && (
                    <h3 className="modal-header__title" tabIndex={-1}>
                      {title}
                    </h3>
                  )}
                </div>
                <div className="mobile-lg:grid-col-3">
                  {closeLink && (
                    <Button
                      iconRight
                      link
                      className="text-no-underline hide-on-mobile float-right margin-right-0 padding-top-0"
                      data-testid="close-modal-button"
                      icon="times-circle"
                      id="close-modal-button"
                      onClick={
                        useRunConfirmSequence
                          ? runConfirmSequence
                          : runCancelSequence
                      }
                    >
                      Close
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {message && <p className={messageClass}>{message}</p>}
            {children}
            {showButtons && (
              <div className="margin-top-5">
                <Button
                  className="modal-button-confirm"
                  data-testid="modal-button-confirm"
                  disabled={disableSubmit}
                  href={confirmHref}
                  id="modal-button-confirm"
                  target={confirmTarget}
                  onClick={runConfirmSequence}
                >
                  {confirmLabel}
                </Button>
                {cancelLabel && (
                  <Button
                    secondary
                    className="modal-button-cancel"
                    link={cancelLink}
                    onClick={runCancelSequence}
                  >
                    {cancelLabel}
                  </Button>
                )}
              </div>
            )}
          </div>
        </dialog>
      </FocusLock>
    );
  };

  return ReactDOM.createPortal(renderModalContent(), getEl());
};
