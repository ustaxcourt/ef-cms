import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import FocusLock from 'react-focus-lock';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const appRoot = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');

class OverlayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.preventEsc = !!this.props.preventEsc;
    this.keydownTriggered = this.keydownTriggered.bind(this);
    this.blurDialog = this.blurDialog.bind(this);
    this.onEscSequence = () => {};
    if (this.props.onEscSequence) {
      this.onEscSequence = this.props.onEscSequence.bind(this);
    }
  }

  toggleNoScroll(scrollingOn) {
    if (scrollingOn) {
      document.body.classList.add('no-scroll');
      document.addEventListener('touchmove', this.touchmoveTriggered, {
        passive: false,
      });
    } else {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('touchmove', this.touchmoveTriggered, {
        passive: false,
      });
    }
  }

  keydownTriggered(event) {
    if (event.keyCode === 27) {
      return this.blurDialog(event);
    }
  }

  touchmoveTriggered(event) {
    return event.preventDefault();
  }

  blurDialog(event) {
    if (this.preventEsc) {
      return false;
    }
    return this.onEscSequence(event);
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
    appRoot.inert = true;
    appRoot.setAttribute('aria-hidden', 'true');
    document.addEventListener('keydown', this.keydownTriggered, false);
    this.toggleNoScroll(true);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
    appRoot.inert = false;
    appRoot.setAttribute('aria-hidden', 'false');
    document.removeEventListener('keydown', this.keydownTriggered, false);
    this.toggleNoScroll(false);
  }

  render() {
    return ReactDOM.createPortal(this.renderModalContent(), this.el);
  }

  renderModalContent() {
    return (
      <FocusLock>
        <dialog open className="modal-screen overlay-full">
          <div
            aria-modal="true"
            className={'modal-overlay'}
            data-aria-live="assertive"
            role="dialog"
          >
            {this.props.children}
          </div>
        </dialog>
      </FocusLock>
    );
  }
}

OverlayComponent.propTypes = {
  children: PropTypes.node,
  onEscSequence: PropTypes.func,
  preventEsc: PropTypes.bool,
};

export const Overlay = connect(
  {
    onEscSequence: sequences[props.onEscSequence],
  },
  OverlayComponent,
);
