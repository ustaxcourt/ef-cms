import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React, { useEffect } from 'react';

export const BatchDownloadProgress = connect(
  {
    batchDownloadHelper: state.batchDownloadHelper,
    showModal: state.showModal,
  },
  ({ batchDownloadHelper, showModal }) => {
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

    console.log('showModal', showModal);

    return (
      <div>
        <div className="sticky-footer sticky-footer--space" />
        <div className="sticky-footer sticky-footer--container">
          <div className="usa-section grid-container padding-bottom-0">
            <div aria-live="polite" className="progress-batch-download">
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
      </div>
    );
  },
);
