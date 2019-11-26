import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const BatchDownloadProgress = connect(
  {
    batchDownloadHelper: state.batchDownloadHelper,
  },
  ({ batchDownloadHelper }) => {
    return (
      <div className="progress-batch-download">
        <div className="status-message">Compressing case files</div>
        <div aria-hidden="true" className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${batchDownloadHelper.percentComplete}%` }}
          />
          <div className="progress-text">
            {batchDownloadHelper.statusMessage}
          </div>
        </div>
      </div>
    );
  },
);
