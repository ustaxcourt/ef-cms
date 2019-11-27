import { FileCompressionErrorModal } from './FileCompressionErrorModal';
import { NavigateAwayWarningModal } from './NavigationWarningModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const BatchDownloadProgress = connect(
  {
    batchDownloadHelper: state.batchDownloadHelper,
    navigationWarningSequence: sequences.navigationWarningSequence,
    showModal: state.showModal,
    zipInProgress: state.zipInProgress,
  },
  ({
    batchDownloadHelper,
    navigationWarningSequence,
    showModal,
    zipInProgress,
  }) => {
    const windowUnload = e => {
      const someSequence = () => {
        navigationWarningSequence({ showModal: 'NavigationWarningModal' });
      };
      const navigateAway = someSequence();
      if (navigateAway) {
        e.preventDefault();
      }
    };

    useEffect(() => {
      window.addEventListener('beforeunload', windowUnload, false);
      return () => {
        window.removeEventListener('beforeunload', windowUnload, false);
      };
    });

    return (
      <div>
        {showModal === 'NavigateAwayWarningModal' && (
          <NavigateAwayWarningModal />
        )}
        {showModal === 'FileCompressionErrorModal' && (
          <FileCompressionErrorModal />
        )}
        {zipInProgress && (
          <div className="usa-section grid-container">
            <hr />
            <div className="progress-batch-download">
              <h3>Compressing Case Files</h3>
              <span className="progress-text">
                {batchDownloadHelper.percentComplete}% Complete
              </span>
              <div
                aria-hidden="true"
                className="progress-bar margin-right-2"
                style={{
                  background: `linear-gradient(to right, #2e8540 0%, #2e8540 ${batchDownloadHelper.percentComplete}%, #ffffff ${batchDownloadHelper.percentComplete}%, #ffffff 100%)`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  },
);
