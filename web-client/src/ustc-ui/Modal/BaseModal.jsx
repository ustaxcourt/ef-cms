import { FocusLock } from '../../ustc-ui/FocusLock/FocusLock';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const modalRoot = window.document.getElementById('modal-root');

export const BaseModal = connect(
  {
    onBlur: sequences[props.onBlurSequence],
  },
  function BaseModal({
    children,
    className,
    displaySuccessBanner = false,
    extraClassNames,
    onBlur,
    preventCancelOnBlur,
  }) {
    extraClassNames = extraClassNames || null;

    const elRef = React.useRef(null);

    const getEl = () => {
      if (!elRef.current) {
        elRef.current = window.document.createElement('div');
      }
      return elRef.current;
    };

    const runBlurSequence = event => {
      event.stopPropagation();
      if (onBlur) {
        onBlur.call();
      }
    };

    const blurDialog = event => {
      if (preventCancelOnBlur) {
        return;
      }
      return runBlurSequence(event);
    };

    useEffect(() => {
      const toggleNoScroll = scrollingOn => {
        if (scrollingOn) {
          window.document.body.classList.add('no-scroll');
        } else {
          window.document.body.classList.remove('no-scroll');
        }
      };

      const keydownTriggered = event => {
        if (event.keyCode === 27) {
          return blurDialog(event);
        }
      };

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
            className={classNames('modal-screen', className)}
            role="dialog"
            onClick={blurDialog}
          >
            <div
              aria-modal="true"
              className={classNames(
                'modal-dialog padding-205',
                displaySuccessBanner && 'modal-success',
                extraClassNames,
              )}
              role="status"
              onClick={event => event.stopPropagation()}
            >
              {children}
            </div>
          </dialog>
        </FocusLock>
      );
    };

    return ReactDOM.createPortal(renderModalContent(), getEl());
  },
);
