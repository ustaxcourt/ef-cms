import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FocusLock from 'react-focus-lock';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const appRoot = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');

export class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');

    this.modal = {};
    this.preventCancelOnBlur = !!this.props.preventCancelOnBlur;
    this.blurDialog = this.blurDialog.bind(this);
    this.keydownTriggered = this.keydownTriggered.bind(this);
    if (this.runCancelSequence) {
      this.runCancelSequence = this.runCancelSequence.bind(this);
    }
    this.runConfirmSequence = this.runConfirmSequence.bind(this);
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

  runCancelSequence(event) {
    event.stopPropagation();
    this.props.cancelSequence.call();
  }
  runConfirmSequence(event) {
    event.stopPropagation();
    this.props.confirmSequence.call();
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
    return this.runCancelSequence(event);
  }
  componentDidMount() {
    modalRoot.appendChild(this.el);
    appRoot.inert = true;
    appRoot.setAttribute('aria-hidden', 'true');
    document.addEventListener('keydown', this.keydownTriggered, false);
    this.toggleNoScroll(true);
    this.focusModal();
    if (this.modalMounted) {
      this.modalMounted();
    }
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
    appRoot.inert = false;
    appRoot.setAttribute('aria-hidden', 'false');
    document.removeEventListener('keydown', this.keydownTriggered, false);

    this.toggleNoScroll(false);
  }

  focusModal() {
    const modalHeader = document.querySelector(
      '.modal-header .modal-header__title',
    );
    modalHeader.focus();
  }

  render() {
    return ReactDOM.createPortal(this.renderModalContent(), this.el);
  }

  renderModalContent() {
    const { modal } = this;
    return (
      <FocusLock>
        <dialog
          open
          className="modal-screen"
          role="dialog"
          onClick={this.blurDialog}
        >
          <div
            aria-live={this.ariaLiveMode || 'assertive'}
            aria-modal="true"
            className={`modal-dialog padding-205 ${modal.classNames}`}
            role="status"
            onClick={event => event.stopPropagation()}
          >
            <div className="modal-header grid-container padding-x-0">
              <div className="grid-row">
                <div className="mobile-lg:grid-col-9">
                  <h3 className="modal-header__title" tabIndex="-1">
                    {modal.title}
                  </h3>
                </div>
                <div className="mobile-lg:grid-col-3">
                  <button
                    className="text-no-underline usa-button usa-button--unstyled hide-on-mobile float-right"
                    type="button"
                    onClick={this.runCancelSequence}
                  >
                    Close{' '}
                    <FontAwesomeIcon className="margin-0" icon="times-circle" />
                  </button>
                </div>
              </div>
            </div>
            {modal.message && <p className="margin-0">{modal.message}</p>}
            {this.renderBody && this.renderBody()}
            <div className="button-box-container">
              <button
                className="usa-button margin-right-205"
                type="button"
                onClick={this.runConfirmSequence}
              >
                {modal.confirmLabel}
              </button>
              {modal.cancelLabel && (
                <button
                  className="usa-button usa-button--outline"
                  type="button"
                  onClick={this.runCancelSequence}
                >
                  {modal.cancelLabel}
                </button>
              )}
            </div>
          </div>
        </dialog>
      </FocusLock>
    );
  }
}

ModalDialog.propTypes = {
  cancelSequence: PropTypes.func,
  confirmSequence: PropTypes.func,
  modal: PropTypes.object,
  preventCancelOnBlur: PropTypes.bool,
};
