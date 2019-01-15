import { connect } from '@cerebral/react';
import { state, sequences } from 'cerebral';
import React from 'react';
import PropTypes from 'prop-types';

class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
    this.keydownTriggered = this.keydownTriggered.bind(this);
  }

  keydownTriggered(event) {
    if (event.keyCode === 27) {
      this.props.clickCancelSequence();
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.keydownTriggered, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownTriggered, false);
  }

  componentDidUpdate() {
    this.focusModal();
  }

  focusModal() {
    const modalHeader = document.querySelector('.modal-dialog h3');
    modalHeader.focus();
  }

  render() {
    const {
      modal,
      showModal,
      clickConfirmSequence,
      clickCancelSequence,
    } = this.props;

    return (
        <div className="modal-screen">
          <div
            className={`modal-dialog ${modal.classNames}`}
            aria-live="assertive"
          >
            <h3 tabIndex="-1">{modal.title}</h3>
            <p>{modal.message}</p>
            <button
              type="button"
              onClick={() => clickConfirmSequence.call()}
              className="usa-button"
            >
              {modal.confirmLabel}
            </button>
            <button
              type="button"
              onClick={() => clickCancelSequence.call()}
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
  showModal: PropTypes.bool,
  clickCancelSequence: PropTypes.func,
  clickConfirmSequence: PropTypes.func,
};

export default connect(
  {
    modal: state.modal,
    showModal: state.showModal,
    clickCancelSequence: sequences.startACaseToggleCancelSequence,
    clickConfirmSequence: sequences.startACaseConfirmCancelSequence,
  },
  ModalDialog,
);
