import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
    this.modal = {};
    this.keydownTriggered = this.keydownTriggered.bind(this);
    this.runCancelSequence = this.runCancelSequence.bind(this);
    this.runConfirmSequence = this.runConfirmSequence.bind(this);
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
      return this.runCancelSequence(event);
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.keydownTriggered, false);
    this.focusModal();
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownTriggered, false);
  }

  componentDidUpdate() {
    console.log(' - componentDidUpdate');
    // this.focusModal();
  }

  focusModal() {
    const modalHeader = document.querySelector('.modal-header .title');
    modalHeader.focus();
  }

  render() {
    const { modal } = this;
    return (
      <div className="modal-screen" onClick={this.runCancelSequence}>
        <div
          className={`modal-dialog ${modal.classNames}`}
          data-aria-live="assertive"
          aria-modal="true"
          role="dialog"
          onClick={event => event.stopPropagation()}
        >
          <div className="modal-header">
            <button
              type="button"
              className="modal-close-button text-style"
              onClick={this.runCancelSequence}
            >
              Close <FontAwesomeIcon icon="times-circle" />
            </button>
            <h3 tabIndex="-1" className="title">
              {modal.title}
            </h3>
          </div>
          <p>{modal.message}</p>
          <button
            type="button"
            onClick={this.runConfirmSequence}
            className="usa-button"
          >
            {modal.confirmLabel}
          </button>
          <button
            type="button"
            onClick={this.runCancelSequence}
            className="usa-button-secondary"
          >
            {modal.cancelLabel}
          </button>
        </div>
      </div>
    );
  }
}

ModalDialog.propTypes = {
  modal: PropTypes.object,
  cancelSequence: PropTypes.func,
  confirmSequence: PropTypes.func,
};

export default ModalDialog;
