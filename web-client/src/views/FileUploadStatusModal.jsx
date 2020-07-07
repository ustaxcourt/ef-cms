import { Button } from '../ustc-ui/Button/Button';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileUploadStatusModal = connect(
  {
    cancelUploadSequence: sequences.cancelFileUploadSequence,
    helper: state.fileUploadStatusHelper,
    percentComplete: state.fileUploadProgress.percentComplete,
  },
  function FileUploadStatusModal({
    cancelUploadSequence,
    helper,
    percentComplete,
  }) {
    return (
      <ModalDialog ariaLiveMode="polite" className="file-upload-status-modal">
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
      </ModalDialog>
    );
  },
);
