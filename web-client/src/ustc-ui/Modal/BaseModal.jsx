import { FocusLock } from '../../ustc-ui/FocusLock/FocusLock';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const modalRoot = document.getElementById('modal-root');

export class BaseModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');

    this.preventCancelOnBlur = !!this.props.preventCancelOnBlur;

    this.blurDialog = this.blurDialog.bind(this);
    this.keydownTriggered = this.keydownTriggered.bind(this);
    this.runBlurSequence = this.runBlurSequence.bind(this);
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

  runBlurSequence(event) {
    event.stopPropagation();
    if (this.props.onBlur) {
      this.props.onBlur.call();
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
    if (this.preventCancelOnBlur) {
      return false;
    }
    return this.runBlurSequence(event);
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
    document.addEventListener('keydown', this.keydownTriggered, false);
    this.toggleNoScroll(true);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
    document.removeEventListener('keydown', this.keydownTriggered, false);
    this.toggleNoScroll(false);
  }

  render() {
    return ReactDOM.createPortal(this.renderModalContent(), this.el);
  }

  renderModalContent() {
    return (
      <FocusLock>
        <dialog
          open
          className={classNames('modal-screen', this.props.className)}
          role="dialog"
          onClick={this.blurDialog}
        >
          <div
            aria-live="assertive"
            aria-modal="true"
            className="modal-dialog padding-205"
            role="status"
            onClick={event => event.stopPropagation()}
          >
            {this.props.children}
          </div>
        </dialog>
      </FocusLock>
    );
  }
}

BaseModalComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onBlur: PropTypes.func,
  preventCancelOnBlur: PropTypes.bool,
};

export const BaseModal = connect(
  {
    onBlur: sequences[props.onBlurSequence],
  },
  BaseModalComponent,
);
