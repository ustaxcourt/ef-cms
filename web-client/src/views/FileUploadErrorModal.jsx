import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

class FileUploadErrorModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel Upload',
      classNames: 'file-upload-error',
      confirmLabel: 'Try Again',
    };
  }

  renderBody() {
    return (
      <div>
        <div className="uhoh">Uh oh!</div>
        <div className="message">
          An error occured while uploading your document and it wasn't
          completed.
        </div>
      </div>
    );
  }
}

export const FileUploadErrorModal = connect(
  { cancelSequence: () => null, confirmSequence: () => null },
  FileUploadErrorModalComponent,
);
