import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Loading = connect(
  {
    currentPage: state.currentPage,
    waitingForResponse: state.waitingForResponse,
  },
  ({ currentPage, waitingForResponse }) => {
    return (
      waitingForResponse && (
        <div
          aria-live="assertive"
          className="loading-overlay progress-indicator"
        >
          {currentPage !== 'Interstitial' && (
            <FontAwesomeIcon
              className="fa-spin spinner"
              icon="sync"
              size="6x"
            />
          )}
        </div>
      )
    );
  },
);
