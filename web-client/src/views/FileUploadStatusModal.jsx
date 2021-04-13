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
      <ModalDialog className="file-upload-status-modal">
        <div>
          <div className="status-message" id="progress-description">
            {helper.statusMessage}
          </div>
          <div
            aria-describedby="progress-description"
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow={percentComplete}
            className="percent-complete"
            role="progressbar"
          >
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
