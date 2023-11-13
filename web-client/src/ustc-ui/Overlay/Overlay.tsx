import { FocusLock } from '../FocusLock/FocusLock';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const modalRoot = window.document.getElementById('modal-root');

const OverlayUnRef = connect(
  {
    onEscSequence: sequences[props.onEscSequence],
  },
  function OverlayUnRef({
    children,
    className,
    forwardedRef,
    onEscSequence,
    preventEsc,
    preventScrolling,
  }) {
    if (!onEscSequence) onEscSequence = () => {};

    const elRef = React.useRef(null);

    const getEl = () => {
      if (!elRef.current) {
        elRef.current = window.document.createElement('div');
      }
      return elRef.current;
    };

    useEffect(() => {
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
            className={classNames('modal-screen', 'overlay-full', className)}
            ref={forwardedRef}
          >
            <div aria-modal="true" className="modal-overlay" role="dialog">
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
   * @param {*} componentProps props
   * @param {*} ref ref
   * @returns {*} the component
   */
  function forwardRef(componentProps, ref) {
    return <OverlayUnRef {...componentProps} forwardedRef={ref} />;
  }

  const name = OverlayUnRef.displayName || OverlayUnRef.name;
  forwardRef.displayName = `Overlay(${name})`;

  return React.forwardRef(forwardRef);
}

export const Overlay = OverlayWithRef();

Overlay.displayName = 'Overlay';
