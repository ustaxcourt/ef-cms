import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const FileUploadErrorModal = connect(
  {
    MAX_FILE_SIZE_MB: state.constants.MAX_FILE_SIZE_MB,
    cancelSequence: sequences.clearModalSequence,
  },
  function FileUploadErrorModal({ cancelSequence, MAX_FILE_SIZE_MB }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        confirmLabel="Close"
        confirmSequence={cancelSequence}
        title={'Your Request Was Not Completed'}
      >
        <div className="file-upload-error">
          There was a problem with your submission. Ensure that your uploaded
          files:
          <ul>
            <li>Are in PDF format (.pdf)</li>
            <li>Have a file size of {MAX_FILE_SIZE_MB}MB or less</li>
            <li>Are not encrypted or password protected</li>
          </ul>
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
