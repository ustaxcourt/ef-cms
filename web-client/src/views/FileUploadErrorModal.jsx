import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const FileUploadErrorModal = connect(
  {
    cancelSequence: sequences.cancelFileUploadSequence,
  },
  function FileUploadErrorModal({ cancelSequence, confirmSequence }) {
    return (
      <ModalDialog
        cancelLabel="Cancel Upload"
        cancelSequence={cancelSequence}
        className="file-upload-error"
        confirmLabel="Try Again"
        confirmSequence={confirmSequence}
      >
        <div>
          <div className="uh-oh">Uh-oh!</div>
          <div className="message">
            An error occurred while uploading your document and it wasn’t
            completed.
          </div>
        </div>
      </ModalDialog>
    );
  },
);

FileUploadErrorModal.displayName = 'FileUploadErrorModal';
