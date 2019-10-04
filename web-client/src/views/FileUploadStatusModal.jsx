import { Button } from '../ustc-ui/Button/Button';
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
    const { cancelUploadSequence, helper, percentComplete } = this.props;
    return (
      <div>
        <div className="status-message">{helper.statusMessage}</div>
        <div aria-hidden="true" className="percent-complete">
          {percentComplete}%
        </div>
        <div aria-hidden="true" className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        {helper.isCancelable && (
          <div className="cancel">
            <Button
              link
              onClick={e => {
                e.stopPropagation();
                cancelUploadSequence();
              }}
            >
              Cancel Upload
            </Button>
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
