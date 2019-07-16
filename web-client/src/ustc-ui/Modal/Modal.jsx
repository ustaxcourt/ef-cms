import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import FocusLock from 'react-focus-lock';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const appRoot = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');

export class ModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');

    this.preventCancelOnBlur = !!this.props.preventCancelOnBlur;
    this.title = this.props.title;
    this.confirmLabel = this.props.confirmLabel || 'Ok';
    this.cancelLabel = this.props.cancelLabel || 'Cancel';
    this.noConfirm = this.props.noConfirm;
    this.noCancel = this.props.noCancel;

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
    if (this.props.onConfirmSequence) {
      this.props.onCancelSequence.call();
    }
  }

  runConfirmSequence(event) {
    event.stopPropagation();
    if (this.props.onConfirmSequence) {
      this.props.onConfirmSequence.call();
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
    return this.runCancelSequence(event);
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
    appRoot.inert = true;
    appRoot.setAttribute('aria-hidden', 'true');
    document.addEventListener('keydown', this.keydownTriggered, false);
    this.toggleNoScroll(true);
    this.focusModal();
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
    return (
      <FocusLock>
        <dialog
          open
          className="modal-screen"
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
            <div className="modal-header grid-container padding-x-0">
              <div className="grid-row">
                <div className="mobile-lg:grid-col-9">
                  <h3 className="modal-header__title" tabIndex="-1">
                    {this.title}
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
            {this.props.children}
            {(!this.noConfirm || !this.noCancel) && (
              <div className="button-box-container">
                {!this.noConfirm && (
                  <button
                    className="usa-button"
                    type="button"
                    onClick={this.runConfirmSequence}
                  >
                    {this.confirmLabel}
                  </button>
                )}

                {!this.noCancel && (
                  <button
                    className="usa-button usa-button--outline"
                    type="button"
                    onClick={this.runCancelSequence}
                  >
                    {this.cancelLabel}
                  </button>
                )}
              </div>
            )}
          </div>
        </dialog>
      </FocusLock>
    );
  }
}

ModalComponent.propTypes = {
  cancelLabel: PropTypes.string,
  children: PropTypes.node,
  confirmLabel: PropTypes.string,
  noCancel: PropTypes.bool,
  noConfirm: PropTypes.bool,
  onCancelSequence: PropTypes.func,
  onConfirmSequence: PropTypes.func,
  preventCancelOnBlur: PropTypes.bool,
  title: PropTypes.string,
};

export const Modal = connect(
  {
    onCancelSequence: sequences[props.onCancelSequence],
    onConfirmSequence: sequences[props.onConfirmSequence],
  },
  ModalComponent,
);
