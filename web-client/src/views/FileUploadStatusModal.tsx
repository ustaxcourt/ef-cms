import { Focus } from '../ustc-ui/Focus/Focus';
import { ModalDialog } from './ModalDialog';
import { ProgressBar } from '../ustc-ui/ProgressBar/ProgressBar';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const FileUploadStatusModal = connect(
  {
    helper: state.fileUploadStatusHelper,
    percentComplete: state.fileUploadProgress.percentComplete,
  },
  function FileUploadStatusModal({ helper, percentComplete }) {
    return (
      <ModalDialog
        className="file-upload-status-modal"
        closeLink={false}
        showButtons={false}
      >
        <Focus>
          <ProgressBar
            aria-labelledby="progress-description"
            value={percentComplete}
          />
        </Focus>
        <div>
          <div
            className="status-message"
            id="progress-description"
            role="status"
          >
            {helper.statusMessage}
          </div>
          <div className="percent-complete">{percentComplete}%</div>
          <div aria-hidden="true" className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          {helper.isHavingSystemIssues && <div>Still processing...</div>}
        </div>
      </ModalDialog>
    );
  },
);

FileUploadStatusModal.displayName = 'FileUploadStatusModal';
