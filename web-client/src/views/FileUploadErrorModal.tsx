import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const FileUploadErrorModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
  },
  function FileUploadErrorModal({ cancelSequence }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        confirmLabel="Close"
        confirmSequence={cancelSequence}
        dataTestId="file-upload-error-modal"
        title={'There Is a Problem With Your Submission'}
      >
        <div className="file-upload-error">
          There is a problem with your submission. Try again later.
          <br />
          <br />
          If you still have a problem after troubleshooting your files, email{' '}
          <a href="mailto:dawson.support@ustaxcourt.gov">
            dawson.support@ustaxcourt.gov
          </a>
          .
        </div>
      </ModalDialog>
    );
  },
);

FileUploadErrorModal.displayName = 'FileUploadErrorModal';
