import { ProgressBar } from '../../ustc-ui/ProgressBar/ProgressBar';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';

export const BatchDownloadProgress = connect(
  {
    batchDownloadHelper: state.batchDownloadHelper,
  },
  function BatchDownloadProgress({ batchDownloadHelper }) {
    const windowUnload = e => {
      e.returnValue =
        'Are you sure you want to navigate away? Changes made will not be saved.';
      e.preventDefault();

      return e.returnValue;
    };

    useEffect(() => {
      window.addEventListener('beforeunload', windowUnload, false);
      return () => {
        window.removeEventListener('beforeunload', windowUnload, false);
      };
    }, []);

    return (
      <div>
        <div className="sticky-footer sticky-footer--space" />
        <div className="sticky-footer sticky-footer--container">
          <div className="usa-section grid-container padding-bottom-0 margin-top-1">
            <div className="progress-batch-download">
              <h3 id="progress-description">
                {batchDownloadHelper.progressDescription}
              </h3>
              <ProgressBar
                aria-labelledby="progress-description"
                value={batchDownloadHelper.percentComplete}
              />
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
      </div>
    );
  },
);

BatchDownloadProgress.displayName = 'BatchDownloadProgress';
