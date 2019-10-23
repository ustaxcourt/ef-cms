import { FocusLock } from '../FocusLock/FocusLock';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const modalRoot = document.getElementById('modal-root');

const OverlayUnRef = connect(
  {
    onEscSequence: sequences[props.onEscSequence],
  },
  ({
    children,
    className,
    forwardedRef,
    onEscSequence,
    preventEsc,
    preventScrolling,
  }) => {
    if (!onEscSequence) onEscSequence = () => {};

    const elRef = React.useRef(null);

    const getEl = () => {
      if (!elRef.current) {
        elRef.current = document.createElement('div');
      }
      return elRef.current;
    };

    useEffect(() => {
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

      const keydownTriggered = event => {
        if (event.keyCode === 27) {
          return blurDialog(event);
        }
      };

      const touchmoveTriggered = event => {
        return event.preventDefault();
      };

      const blurDialog = event => {
        if (preventEsc) {
          return false;
        }
        return onEscSequence(event);
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
            className={classNames('modal-screen', 'overlay-full', className)}
            ref={forwardedRef}
          >
            <div
              aria-live="assertive"
              aria-modal="true"
              className="modal-overlay"
              role="dialog"
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

/**
 * OverlayWithRef
 *
 * @returns {*} the wrapped overlay component
 */
function OverlayWithRef() {
  /**
   * forwardRef
   *
   * @param {*} props props
   * @param {*} ref ref
   * @returns {*} the component
   */
  function forwardRef(props, ref) {
    return <OverlayUnRef {...props} forwardedRef={ref} />;
  }

  const name = OverlayUnRef.displayName || OverlayUnRef.name;
  forwardRef.displayName = `Overlay(${name})`;

  return React.forwardRef(forwardRef);
}

export const Overlay = OverlayWithRef();
