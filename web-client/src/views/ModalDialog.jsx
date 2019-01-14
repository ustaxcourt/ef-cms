import { connect } from '@cerebral/react';
import { state, sequences } from 'cerebral';
import React from 'react';

export default connect(
  {
    modal: state.modal,
    showModal: state.showModal,
    clickCancelSequence: sequences.startACaseToggleCancelSequence,
    clickConfirmSequence: sequences.startACaseConfirmCancelSequence,
  },
  function ModalDialog({
    modal,
    showModal,
    clickConfirmSequence,
    clickCancelSequence,
  }) {
    return (
      showModal && (
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
      )
    );
  },
);
