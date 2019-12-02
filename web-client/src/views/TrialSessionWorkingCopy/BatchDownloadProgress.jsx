import { FileCompressionErrorModal } from './FileCompressionErrorModal';
// import { NavigateAwayWarningModal } from './NavigateAwayWarningModal';
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
      const navigateAway = false;
      /* navigationWarningSequence({
        showModal: 'NavigateAwayWarningModal',
      });
      */
      if (navigateAway && navigationWarningSequence === 'bananas') {
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
        {/* {showModal === 'NavigateAwayWarningModal' && (
          <NavigateAwayWarningModal />
        )} */}
        {showModal === 'FileCompressionErrorModal' && (
          <FileCompressionErrorModal />
        )}
        {zipInProgress && (
          <>
            <div className="sticky-footer sticky-footer--space" />
            <div className="sticky-footer sticky-footer--container">
              <div className="usa-section grid-container padding-bottom-0">
                <div
                  aria-live="polite"
                  className="progress-batch-download padding-top-105 padding-bottom-105"
                >
                  <h3>Compressing Case Files</h3>
                  <span className="progress-text">
                    {batchDownloadHelper.percentComplete}% Complete
                  </span>
                  <div
                    aria-hidden="true"
                    className="progress-bar margin-right-2"
                    style={{
                      background: `linear-gradient(to right, #2e8540 ${batchDownloadHelper.percentComplete}%, #fff 0% 100%)`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
);
