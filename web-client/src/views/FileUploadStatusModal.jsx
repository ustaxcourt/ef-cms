import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

class FileUploadStatusComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      classNames: 'file-upload-status-modal',
    };
  }

  renderBody() {
    const { cancelSequence, percentComplete, statusMessage } = this.props;
    return (
      <div>
        <div className="status-message">{statusMessage}</div>
        <div className="percent-complete">{percentComplete}%</div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        {percentComplete < 100 && (
          <div className="cancel">
            <a
              onClick={e => {
                e.stopPropagation();
              }}
              href={cancelSequence()}
            >
              Cancel Upload
            </a>
          </div>
        )}
      </div>
    );
  }
}

export const FileUploadStatusModal = connect(
  {
    cancelSequence: () => null,
    percentComplete: null || 0,
    statusMessage: null || '',
  },
  FileUploadStatusComponent,
);
