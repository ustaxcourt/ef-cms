import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class FileUploadStatusComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.ariaLiveMode = 'polite';
    this.modal = {
      classNames: 'file-upload-status-modal',
    };
  }

  renderBody() {
    const { cancelUploadSequence, percentComplete, helper } = this.props;
    return (
      <div>
        <div className="status-message">{helper.statusMessage}</div>
        <div className="percent-complete" aria-hidden="true">
          {percentComplete}%
        </div>
        <div className="progress-bar" aria-hidden="true">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        {helper.isCancelable && (
          <div className="cancel">
            <button
              onClick={e => {
                e.stopPropagation();
                cancelUploadSequence();
              }}
              className="link"
            >
              Cancel Upload
            </button>
          </div>
        )}
      </div>
    );
  }
}

export const FileUploadStatusModal = connect(
  {
    cancelUploadSequence: sequences.cancelFileUploadSequence, // TODO: replace with a real cancel sequence
    helper: state.fileUploadStatusHelper,
    percentComplete: state.percentComplete,
  },
  FileUploadStatusComponent,
);
