import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const FileUploadErrorModal = connect(
  {
    cancelSequence: sequences.cancelFileUploadSequence,
  },
  ({ cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel Upload"
        cancelSequence={cancelSequence}
        className="file-upload-error"
        confirmLabel="Try Again"
        confirmSequence={confirmSequence}
        message="An error occured while uploading your document and it wasn’t completed."
        title="Uh-oh!"
      ></ModalDialog>
    );
  },
);
