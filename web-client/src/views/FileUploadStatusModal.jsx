import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class FileUploadStatusComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      classNames: 'file-upload-status-modal',
    };
  }

  renderBody() {
    const { cancelSequence, percentComplete, helper } = this.props;
    return (
      <div>
        <div className="status-message">{helper.statusMessage}</div>
        <div className="percent-complete">{percentComplete}%</div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        {percentComplete < 100 && (
          <div className="cancel">
            <button
              onClick={e => {
                e.stopPropagation();
                cancelSequence();
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
    cancelSequence: sequences.cancelFileUploadSequence, // TODO: replace with a real cancel sequence
    helper: state.fileUploadStatusHelper,
    percentComplete: state.percentComplete,
  },
  FileUploadStatusComponent,
);
