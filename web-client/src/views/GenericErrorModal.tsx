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
        cancelSequence={clearModalSequence}
        closeLink={true}
        confirmLabel="Close"
        confirmSequence={clearModalSequence}
        dataTestId="error-modal"
        title={modalTitle || 'An error occurred'}
      >
        {message || 'Something went wrong, please try again later.'}
        <br />
        <br />
        <a className="usa-link--external" href="https://google.com">
          Learn about troubleshooting files
        </a>
        <br />
        <br />
        If you still have a problem uploading the file, email{' '}
        <a href="mailto:dawson.support@ustaxcourt.gov">
          dawson.support@ustaxcourt.gov
        </a>
        .
      </ModalDialog>
    );
  },
);

GenericErrorModal.displayName = 'GenericErrorModal';
