import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const GenericErrorModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    message: state.modal.message,
    modalTitle: state.modal.title,
  },
  function GenericErrorModal({ clearModalSequence, message, modalTitle }) {
    return (
      <ModalDialog
        cancelLink={false}
        closeLink={false}
        confirmLabel="Close"
        confirmSequence={clearModalSequence}
        title={modalTitle || 'An error occured'}
      >
        {message || 'Something went wrong, please try again later.'}
      </ModalDialog>
    );
  },
);

GenericErrorModal.displayName = 'GenericErrorModal';
