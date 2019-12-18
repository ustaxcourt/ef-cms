import { FocusLock } from '../../ustc-ui/FocusLock/FocusLock';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const modalRoot = document.getElementById('modal-root');

export const BaseModal = connect(
  {
    onBlur: sequences[props.onBlurSequence],
  },
  ({ children, className, extraClassNames, onBlur, preventCancelOnBlur }) => {
    extraClassNames = extraClassNames || null;

    const elRef = React.useRef(null);

    const getEl = () => {
      if (!elRef.current) {
        elRef.current = document.createElement('div');
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
        return false;
      }
      return runBlurSequence(event);
    };

    useEffect(() => {
      const touchmoveTriggered = event => {
        return event.preventDefault();
      };

      const toggleNoScroll = scrollingOn => {
        if (scrollingOn) {
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

      const keydownTriggered = event => {
        if (event.keyCode === 27) {
          return blurDialog(event);
        }
      };

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
            className={classNames('modal-screen', className)}
            role="dialog"
            onClick={blurDialog}
          >
            <div
              aria-live="assertive"
              aria-modal="true"
              className={classNames(
                'modal-dialog padding-205',
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
